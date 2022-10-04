import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataConnection, Peer } from 'peerjs';
import { Subject } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PeerState } from '../enums/peer-state.enum';
import { PeerType } from '../enums/peer-type.enum.ts';
import { BattlePeer } from '../models/battle-peer.model';
import { PeerData } from '../models/peer-data.model';
import { BattleService } from './battle.service';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {
  private _peer!: Peer;
  private _peerType!: PeerType;
  private _connections!: DataConnection[];
  private _peerId!: string;
  public peers!: BattlePeer[];
  private _peerState!: PeerState;
  public refreshUi: Subject<null>;
  public disconnectedPeerIndex: Subject<number>;
  private interval: any;
  private heartbeatCheck: boolean;
  private heartbeatLength: number;

  constructor(
    private readonly battleService: BattleService,
    private readonly core: CoreService,
    private readonly popup: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly router: Router
  ) {
    this.heartbeatLength = 5000;
    this.peers = [];
    this.battleService.battleSubject.subscribe((change) =>
      this.stateChange(change)
    );
    this.refreshUi = new Subject();
    this.disconnectedPeerIndex = new Subject();
    this.heartbeatCheck = false;
  }

  public initializePeer(): void {
    this.peers = [];
    this._connections = [];
    this._peerType = PeerType.Host;
    this._peer = new Peer({
      config: {
        iceServers: [
          { urls: ['stun:51.15.25.223:3478'] },
          {
            urls: ['turn:51.15.25.223:3478'],
            username: 'warcry',
            credential: 'companion'
          }
        ]
      }
    });
    this._peerState = PeerState.Unready;
    let peerIndex;
    this._peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        switch ((data as PeerData).data.type) {
          case 'join':
            if (this.peers.findIndex((peer) => peer.peerId === conn.peer) < 0) {
              if (
                this.battleService.battle.battleState >
                (data as PeerData).data.phase
              ) {
                this.privateMessage(
                  { peerId: this._peerId, data: { type: 'roster' } },
                  conn.peer
                );
              }
              const newPeer = (data as PeerData).data.peer as BattlePeer;
              this.dialog.open(ConfirmDialogComponent, {
                data: {
                  confirmation: true,
                  noLabel: 'common.ok',
                  question: this.translateService.instant(
                    'multiplayer.dialog.peer-joined',
                    { peer: newPeer.warband.name }
                  )
                },
                closeOnNavigation: false
              });
              newPeer.hostIndex = this.peers.length;
              this.peers.push(newPeer);
              this.refreshUi.next(null);
              this.broadcast({
                peerId: conn.peer,
                data: { type: 'join', peer: newPeer }
              });
            }
            break;
          case 'ready':
            peerIndex = this.peers.findIndex(
              (peer) => peer.peerId === (data as PeerData).peerId
            );
            if (peerIndex > -1) {
              this.peers[peerIndex].state = PeerState.Ready;
              this.refreshUi.next(null);
              this.broadcast(data as PeerData);
            }
            break;
          case 'unready':
            peerIndex = this.peers.findIndex(
              (peer) => peer.peerId === (data as PeerData).peerId
            );
            if (peerIndex > -1) {
              this.peers[peerIndex].state = PeerState.Unready;
              this.refreshUi.next(null);
              this.broadcast(data as PeerData);
            }
            break;
          case 'heartbeat':
            (conn as any).heartbeat = Date.now();
            this.privateMessage(
              { peerId: this.peerId, data: { type: 'heartbeat' } },
              conn.peer
            );
            if (!this.interval) {
              this.interval = setInterval(() => {
                const checkTimestamp = Date.now();
                this._connections.forEach((conn) => {
                  if ((conn as any).heartbeat < checkTimestamp - this.heartbeatLength * 2) {
                    let peerIndex = this.peers.findIndex(
                      (peer) => peer.peerId === conn.peer
                    );
                    this.disconnectedPeerIndex.next(peerIndex);
                    if (peerIndex > -1) {
                      this.dialog.open(ConfirmDialogComponent, {
                        data: {
                          confirmation: true,
                          noLabel: 'common.ok',
                          question: this.translateService.instant(
                            'multiplayer.dialog.peer-disconnected',
                            { peer: this.peers[peerIndex].warband.name }
                          )
                        },
                        closeOnNavigation: false
                      });
                      this.peers.splice(peerIndex, 1);
                      this.broadcast({
                        peerId: this._peerId,
                        data: {
                          type: 'disconnected',
                          peer: conn.peer
                        }
                      });
                      this.refreshUi.next(null);
                    }
                    peerIndex = this._connections.findIndex(
                      (peer) => peer.peer === conn.peer
                    );
                    if (peerIndex > -1) {
                      this._connections.splice(peerIndex, 1);
                    }
                  }
                });
              }, this.heartbeatLength + 1000);
            }
            break;
          case 'state-change':
            this.handleStateChange(
              (data as PeerData).peerId,
              (data as PeerData).data
            );
            this.broadcast(data as PeerData);
            break;
          case 'disconnected':
            peerIndex = this.peers.findIndex(
              (peer) => peer.peerId === (data as PeerData).data.peer
            );
            if (peerIndex > -1) {
              this.peers.splice(peerIndex, 1);
              this.refreshUi.next(null);
            }
            break;
          default:
            this.broadcast(data as PeerData);
            break;
        }
      });
      conn.on('open', () => {
        this.privateMessage(
          {
            peerId: this._peerId,
            data: {
              type: 'session',
              battle: this.battleService.battle,
              peers: this.peers,
              hostState: this.peerState
            }
          },
          conn.peer
        );
      });
      conn.on('close', () => {
        const peerIndex = this.peers.findIndex(
          (peer) => peer.peerId === conn.peer
        );
        this.disconnectedPeerIndex.next(peerIndex);
        if (peerIndex > -1) {
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              confirmation: true,
              noLabel: 'common.ok',
              question: this.translateService.instant(
                'multiplayer.dialog.peer-disconnected',
                { peer: this.peers[peerIndex].warband.name }
              )
            },
            closeOnNavigation: false
          });
          this.peers.splice(peerIndex, 1);
          this.broadcast({
            peerId: this._peerId,
            data: {
              type: 'disconnected',
              peer: conn.peer
            }
          });
          this.refreshUi.next(null);
        }
      });
      (conn as any).heartbeat = Date.now();
      this._connections.push(conn);
    });
    this._peer.on('open', (id) => {
      this._peerId = id;
    });
  }

  public connectPeer(peerId: string, connectedCb: () => any = () => {}): void {
    this.core.startLoader();
    let loaderFailSafe = true;
    let peerIndex;
    setTimeout(() => {
      if (loaderFailSafe) {
        this.core.stopLoader();
        this.popup.open(
          `${this.translateService.instant('multiplayer.error.unable')}`,
          undefined,
          {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 1000,
            panelClass: 'bottom-snackbar'
          }
        );
        this.disconnect();
      }
    }, 5000);
    this._peerType = PeerType.Peer;
    this._connections = [];
    this.peers = [];
    const connection = this._peer.connect(peerId);
    connection.on('open', () => {
      loaderFailSafe = false;
      this.broadcast({
        peerId: this._peerId,
        data: {
          type: 'join',
          peer: {
            peerId: this._peerId,
            warband: this.battleService.battle.warband,
            hammer: this.battleService.battle.hammer,
            shield: this.battleService.battle.shield,
            dagger: this.battleService.battle.dagger,
            victoryPoints: this.battleService.battle.victoryPoints,
            state: PeerState.Unready
          },
          phase: this.battleService.battle.battleState
        }
      });
      this.interval = setInterval(() => {
        this.broadcast({ peerId: this.peerId, data: { type: 'heartbeat' } });
        this.heartbeatCheck = true;
        setTimeout(() => {
          if (this.heartbeatCheck) {
            this.disconnect();
          }
        }, 1000);
      }, this.heartbeatLength);
    });
    connection.on('close', () => {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          confirmation: true,
          noLabel: 'common.ok',
          question: this.translateService.instant(
            'multiplayer.dialog.disconnected'
          )
        },
        closeOnNavigation: false
      });
      this.disconnectedPeerIndex.next(-1);
      this.disconnect();
    });
    connection.on('data', (data) => {
      if ((data as PeerData).peerId !== this._peerId) {
        switch ((data as PeerData).data.type) {
          case 'session':
            this.dialog.open(ConfirmDialogComponent, {
              data: {
                confirmation: true,
                noLabel: 'common.ok',
                question: this.translateService.instant(
                  'multiplayer.dialog.joined',
                  { peer: (data as PeerData).data.battle.warband.name }
                )
              },
              closeOnNavigation: false
            });
            this.peers.push({
              peerId: connection.peer,
              warband: (data as PeerData).data.battle.warband,
              hammer: (data as PeerData).data.battle.hammer,
              shield: (data as PeerData).data.battle.shield,
              dagger: (data as PeerData).data.battle.dagger,
              victoryPoints: (data as PeerData).data.battle.victoryPoints,
              state: (data as PeerData).data.hostState,
              type: PeerType.Host
            });
            this.peers.push(
              ...(data as PeerData).data.peers.filter(
                (peer: BattlePeer) => peer.peerId != this._peerId
              )
            );
            this.battleService.battle.turn = (
              data as PeerData
            ).data.battle.turn;
            this.battleService.battle.wild = (
              data as PeerData
            ).data.battle.wild;
            this.router.navigate(['battle']);
            connectedCb();
            this.core.stopLoader();
            this.refreshUi.next(null);
            break;
          case 'join':
            this.dialog.open(ConfirmDialogComponent, {
              data: {
                confirmation: true,
                noLabel: 'common.ok',
                question: this.translateService.instant(
                  'multiplayer.dialog.peer-joined',
                  { peer: (data as PeerData).data.peer.warband.name }
                )
              },
              closeOnNavigation: false
            });
            this.peers.push((data as PeerData).data.peer);
            this.refreshUi.next(null);
            break;
          case 'ready':
            peerIndex = this.peers.findIndex(
              (peer) => peer.peerId === (data as PeerData).peerId
            );
            if (peerIndex > -1) {
              this.peers[peerIndex].state = PeerState.Ready;
              this.refreshUi.next(null);
            }
            break;
          case 'unready':
            peerIndex = this.peers.findIndex(
              (peer) => peer.peerId === (data as PeerData).peerId
            );
            if (peerIndex > -1) {
              this.peers[peerIndex].state = PeerState.Unready;
              this.refreshUi.next(null);
            }
            break;
          case 'heartbeat':
            this.heartbeatCheck = false;
            break;
          case 'state-change':
            this.handleStateChange(
              (data as PeerData).peerId,
              (data as PeerData).data
            );
            break;
          case 'disconnected':
            peerIndex = this.peers.findIndex(
              (peer) => peer.peerId === (data as PeerData).data.peer
            );
            this.disconnectedPeerIndex.next(peerIndex);
            if (peerIndex > -1) {
              this.dialog.open(ConfirmDialogComponent, {
                data: {
                  confirmation: true,
                  noLabel: 'common.ok',
                  question: this.translateService.instant(
                    'multiplayer.dialog.peer-disconnected',
                    { peer: this.peers[peerIndex].warband.name }
                  )
                },
                closeOnNavigation: false
              });
              this.peers.splice(peerIndex, 1);
              this.refreshUi.next(null);
            }
            break;
          default:
            this.broadcast(data as PeerData);
            break;
        }
      }
    });
    this._connections.push(connection);
  }

  public ready(): void {
    this._peerState = PeerState.Ready;
    this.broadcast({
      peerId: this.peerId,
      data: { type: 'ready' }
    });
  }

  public unready(): void {
    this._peerState = PeerState.Unready;
    this.broadcast({
      peerId: this.peerId,
      data: { type: 'unready' }
    });
  }

  public disconnect(): void {
    clearInterval(this.interval);
    this._peer.destroy();
    this.initializePeer();
    this.refreshUi.next(null);
  }

  public stateChange(change: any): void {
    switch (change.changed) {
      case 'end-turn':
        this._peerState = PeerState.Unready;
        this.peers.forEach((peer) => (peer.state = PeerState.Unready));
        break;

      default:
        break;
    }
    this.broadcast({
      peerId: this.peerId,
      data: {
        type: 'state-change',
        ...change
      }
    });
    this.refreshUi.next(null);
  }

  public handleStateChange(peerId: string, change: any): void {
    let peerIndex;
    switch (change.changed) {
      case 'end-turn':
        this._peerState = PeerState.Unready;
        this.peers.forEach((peer) => (peer.state = PeerState.Unready));
        this.battleService.endTurnEffect(() => {
          this.refreshUi.next(null);
        });
        break;
      case 'wild-fighter':
        this._peerState = PeerState.Unready;
        this.peers.forEach((peer) => (peer.state = PeerState.Unready));
        this.battleService.addWildFighterEffect(change.wildFighter, () => {
          this.refreshUi.next(null);
        });
        break;
      case 'wild-fighter-remove':
        this._peerState = PeerState.Unready;
        this.peers.forEach((peer) => (peer.state = PeerState.Unready));
        this.battleService.removeWildFighterEffect(change.wildFighter, () => {
          this.refreshUi.next(null);
        });
        break;
      case 'victory-points':
        peerIndex = this.peers.findIndex((peer) => peer.peerId === peerId);
        if (peerIndex > -1) {
          this.peers[peerIndex].victoryPoints = change.value;
          this.refreshUi.next(null);
        }
        break;
      case 'fighter':
        if (change.group === 'wild') {
          this.battleService.battle.wild[change.index].carryingTreasure =
            change.fighter.carryingTreasure;
          this.battleService.battle.wild[change.index].wounds =
            change.fighter.wounds;
          this.battleService.battle.wild[change.index].notes =
            change.fighter.notes;
          this.battleService.battle.wild[change.index].state =
            change.fighter.state;
        } else {
          peerIndex = this.peers.findIndex((peer) => peer.peerId === peerId);
          if (peerIndex > -1) {
            (this.peers[peerIndex] as any)[change.group][
              change.index
            ].carryingTreasure = change.fighter.carryingTreasure;
            (this.peers[peerIndex] as any)[change.group][change.index].wounds =
              change.fighter.wounds;
            (this.peers[peerIndex] as any)[change.group][change.index].notes =
              change.fighter.notes;
            (this.peers[peerIndex] as any)[change.group][change.index].state =
              change.fighter.state;
          }
        }

        this.refreshUi.next(null);
        break;

      default:
        break;
    }
  }

  public broadcast(message: PeerData): void {
    this._connections.forEach((connection) => {
      if (message.peerId !== connection.peer) {
        connection.send(message);
      }
    });
  }

  public privateMessage(message: PeerData, peer: string): void {
    const selected = this._connections.find(
      (connection) => peer === connection.peer
    );
    if (selected) {
      selected.send(message);
    }
  }

  public get peerId(): string {
    return this._peerId;
  }

  public get peerType(): string {
    return this._peerType;
  }

  public get host(): boolean {
    return this._peerType === PeerType.Host;
  }

  public get peerState(): PeerState {
    return this._peerState;
  }

  public get connected(): boolean {
    return this.peers.length > 0;
  }

  public get allReady(): boolean {
    return (
      this._peerState === PeerState.Ready &&
      this.peers.findIndex((peer) => peer.state === PeerState.Unready) === -1
    );
  }

  public get meReady(): boolean {
    return this._peerState === PeerState.Ready;
  }
}
