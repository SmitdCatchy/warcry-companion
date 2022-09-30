<h1><img align="center" src="https://smitdcatchy.github.io/warcry-companion/assets/icons/icon-72x72.png"> Warcry Companion</h1>

This project was created to give an easy to use companion application to play Warcry. I hope it will be your go to warband manager and will be an invaluable asset during games to keep track of the fighters and win conditions.

You can access the application via [this link](https://smitdcatchy.github.io/warcry-companion/).

For a guide on how to use the app click on [this link](https://github.com/SmitdCatchy/warcry-companion/blob/main/GUIDE.md#-how-to-use-the-warcry-companion).

## Ideas and Features

If you have any ideas of features that could improve the application feel free to share!

Discuss it with other users following [this link](https://github.com/SmitdCatchy/warcry-companion/discussions), or if you are pretty sure that your idea is solid you can create a request on [this link](https://github.com/SmitdCatchy/warcry-companion/issues/new) and create a new issue with your feature as the title and with the "feature request" label selected on the right. Please describe the feature as detailed as you can in the comment section.

One of the main principles of this project is for the application to avoid containing any assets that could cause copyright infringement. So please do not create any requests about adding runemark icons or default rules and keywords.

## Language support

If your language is not supported do not worry. You can help to add it to the list of supported languages!

Simply click on [this link](https://github.com/SmitdCatchy/warcry-companion/issues/new) and create a new issue with your language as the title and with the "language" label selected on the right. After that you will be contacted with the required steps to add your language to this application.

## Bugs

If you happen to find a bug please create a bug ticket on [this link](https://github.com/SmitdCatchy/warcry-companion/issues/new) and create a new issue with a short description as the title and with the "bug" label selected on the right. Please describe the bug as detailed as you can in the comment section.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deployment build

Run `ng deploy` to build the project and create the `docs/` directory that is the release directory for GitHub Pages.

## Versions

### 3.0.0 Chosen - 2022.09.30.

Feature added multiplayer battles.

Fix: color inconsistencies.

### 2.2.5 - 2022.09.08.

Fix: handle webkit style errors.

### 2.2.4 - 2022.09.07.

<details>
  <summary>Features</summary>

- updated the guide.
- fighter groups are displayed as columns on wide screens.

</details

<details>
  <summary>Fixes</summary>

- navigating back from an initially loaded screen will always go to Main screen.
- renown no longer visible during non campaign battles.

</details

### 2.2.3 - 2022.09.06.

Fix: pwa update dialog.

### 2.2.2 - 2022.09.05.

Feature: added pwa shorcuts and update.

### 2.2.1 - 2022.09.03.

Feature: added a guide for the app.

<details>
  <summary>Fixes</summary>

- removed unnecessary loading spinners.
- fixed single fighter group top spacing in the Battle phase.

</details>

### 2.2.0 - 2022.09.03.

Feature: you can update all fighters in all the warbands with all the fighter types in the Fighter Store.

<details>
  <summary>Fixes</summary>

- show abilities of allies, monsters and thralls on Fighter Store screen.
- fix lineheight of names on Fighter cards.
- removed redundant strings.
- fix leader role removing Hero runemark and adding Leader runemark unnecessarily.
- fix fighter role adding Fighter runemark unnecessarily.
- fix light mode.
- fix loading spinner on mobiles if nothing is selected.

</details>

### 2.1.1 - 2022.09.01.

<details>
  <summary>Fixes</summary>

- made dialogs uniform.
- added different button bar on warband tabs.

</details>

### 2.1.0 - 2022.09.01.

<details>
  <summary>Features</summary>

- added loading spinners to imports.
- added check for imported files.

</details>

### 2.0.0 Berzerker - 2022.08.31.

<details>
  <summary>Features</summary>

- added grid views of the fighter lists on all the screens on medium to large devices.
- added button bar of important functions instead of footer on small screen devices.
- end turn dialog now lists the not fully activated fighters.
- added a new turn popup.
- relocated version into main screen menu.

</details>

<details>
  <summary>Fixes</summary>

- monsters can use universal reactions.
- viewport height on mobile devices (the footer was not visible).

</details>

### 1.2.2 - 2022.08.29.

Fix: fighters with the Monster role can have modifiers.

### 1.2.1 - 2022.08.28.

<details>
  <summary>Features</summary>

- added a new fighter type: Ally.
- added prohibitive runemark form field in ability dialog.
- sort abilities by type and name.

</details>

<details>
  <summary>Fixes</summary>

- allies and thralls can have abilities.
- always show best monster stats if not in battle.

</details>

### 1.2.0 - 2022.08.28.

<details>
  <summary>Features</summary>

- added a new fighter type: Beast.
- in the Fighter dialog selecting a fighter role adds default runemarks based on the role.
- the Fighter Store screen and Fighter Load dialog has factions.
- there is a tie option for the battle end result.
- fighters with the Beast and Monster roles no longer have the Carry treasure option pn the Battle Page during the Battle phase.
- fighters with the Monster role can have modifiers.

</details>

<details>
  <summary>Fixes</summary>

- navigating back from a dialog will close the dialog instead of navigating back to the previous screen.
- the uploaded icons are a bit bigger.
- too long faction names are truncated in the screen title.

</details>

### 1.1.0 - 2022.08.25.

<details>
  <summary>Features</summary>

- Fighter Store:
  - you can navigate to the Battlegrounds screen from the Main screen by pressing the Fighter Store option in the menu.
  - on the Fighter Store screen you can create/edit/remove fighter types separately from warbands in/from the Fighter Store.
  - you can load/store/update/remove fighter types in the Fighter add/edit dialog by pressing on the Fighter Store button and selecting the desired option.

- Warbands: on the Main screen in the Warband card options you can duplicate the warband.

</details>

<details>
  <summary>Fixes</summary>

- Universal:
  - the app supports displays as narrow as 320px.
  - expansion panels have a more noticeable design.
  - routing error fixed

</details>

### 1.0.0 Auric - 2022.08.13.

<details>
  <summary>Features</summary>

- Warband dialog:  
  - on the Main screen:
    - in the menu you can create/import warbands.
    - if there are no warbands then buttons appear to create/import a warband.
  - the dialog form contains the following fields:
    - icon upload: it uploads and compresses an image to be your fighter's icon.
    - Name: this will be your warband's name.
    - Faction: this shows what faction the warband belongs to.
    - Alliance: this shows which grand alliance the warband belongs to.
    - Color: this color will determine the theme color of your warband.

- Warbands:
  - on the Main screen each warband has a separate Warband card.
  - you can navigate to Warband screens by pressing on the Warband Cards.
  - you can change the warbands order by pressing and holding the Warband card options icon.
  - in the Warband card options:
    - you can navigate to the Warband screen by pressing on Select Warband.
    - you can remove a warband by pressing on Remove Warband.
  - on the Warband screen:
    - the screen title is the warband's name.
    - under the Warband tab you can edit your warband record and add/edit/remove your warband's abilities.

- Fighter dialog:
  - on the Warband screen under the Fighters tab you can add/edit fighters to/in the warband with the Fighter dialog.
  - the dialog form contains the following fields:
    - icon upload: it uploads and compresses an image to be your fighter's icon.
    - Narrative Name: this will be your fighter's name in a narrative context.
    - Type: this is your fighter's type.
    - Role: this is your fighter's role in the warband. By default it is the basic fighter role but you can select the following roles:
      - Leader: this fighter is the leader of the warband, there should be only one. You should add the Hero runemark.
      - Hero: this fighter is an outstanding fighter of the warband. You should add the Hero runemark.
      - Monster: this fighter is a monster and it will have some special rules and fields in the form. You should add the Monster runemark.
      - Thrall: this fighter is a thrall of the warband. You should add the Thrall runemark.
    - Points: this shows how many points the fighter costs.
    - Runemarks: this list shows what runemarks does the fighter have.
    - Move: this shows the fighter's Move characteristic.
    - Toughness: this shows the fighter's Toughness characteristic.
    - Wounds: this shows the fighter's Wounds characteristic.
    - The Weapons section shows the fighter's available weapons.
    - Range: this shows the range of the fighter's attack action.
    - Attacks: this shows the number of dice rolled for the fighter's attack action.
    - Strength: this shows the strength of the fighter's attack action.
    - Damage: this shows the damage and crit damage of the fighter's attack action.
    - you can add an additional weapon to your fighter by pressing the Add Secondary Weapon button.
    - you can remove the secondary weapon of your fighter by pressing the Remove Secondary Weapon button.
    - if your fighter is a monster it will have a Damage Table. You can:
      - add an additional row by pressing the Add Damage Table Row button.
      - remove a row by pressing the trash icon directly to its right.
      - you can define a Minimum health for the following stats to apply.
      - you can define the move and damage stats for every given tier of damage.

- Fighters:
  - a Fighter card shows the fighter's:
    - type.
    - name if the fighter has one.
    - marks the fighter as Leader if the fighter is one.
    - point value.
  - you can expand a Fighter card by pressing it.
  - an expanded Fighter card shows the fighter's:
    - stats, runemarks and weapons.
    - modifiers.
    - abilities if the fighter is a Monster.
  - on the Warband screen under the Fighters tab:
    - you can remove fighters from the warband.
    - each fighter has a separate Fighter card.
    - an expanded Fighter card additionally shows:
      - the fighter's campaign record.
      - buttons to edit/remove the fighter's modifiers/abilities.
      - options to edit/duplicate/remove the fighter.
  - on the Battle screen in the Preparation phase an expanded Fighter card additionally shows options to choose a group for the fighter.
  - on the Battle screen in the Battle phase:
    - the fighter's point value is hidden.
    - an Fighter card has:
      - a state box that you can interact with to select the fighter's current state.
      - a wound counter, that you can interact with to note down the fighter's current wound.
    - if the fighter has 0 wounds it's Fighter card becomes disabled.
    - an expanded Fighter card additionally shows:
      - a state box for usable modifiers.
      - options to carry/drop treasure and take notes.

- Ability dialog:
  - on the Warband screen under:
    - the Fighters tab you can add/edit abilities to/in a monster fighter with the Ability dialog.
    - the Warband tab you can add/edit abilities to/in your warband with the Ability dialog.
  - on the Battlegrounds page you can add/edit abilities to/in your battleground with the Ability dialog.
  - the dialog form contains the following fields:
    - Type: it shows what the player needs to activate the ability.
    - Name: this is the name of the ability.
    - Runemarks: this list shows what runemarks are required to be able to use this ability.
    - Description: this describes how the ability works.

- Abilities:
  - you can show the abilities list:
    - on the Warband screen:
      - in the menu by pressing Warband Abilities, that will show the warband specific abilities.
      - in a Fighter card by pressing the fighter runemarks, that will show the warband specific abilities available to that fighter.
    - on the Battle screen if you have a selected warband in the menu by pressing Warband Abilities, that will show the warband specific abilities.
    - on the Battle screen in a Fighter card by pressing the fighter runemarks, that will show the warband specific and all the selected battleground abilities, including the Universal Abilities available to that fighter.

- Modifier dialog:
  - on the Warband screen under:
    - the Fighters tab you can add/edit abilities to/in a monster fighter with the Ability dialog.
  - the dialog form contains the following fields:
    - Type: it shows what kind of modifier it is. It can be an Artifact, an Injury or a Trait.
    - Name: this is the name of the modifier.
    - Usable: if enabled this will provide a state box on the Fighter card during battles to be able to indicate if the modifier has been used.
    - Attribute: this is an additional attribute for the modifier type e.g. Greater Artifact.
    - Description: this describes how the modifier works.

- Modifiers:
  - you can see modifiers on the associated Fighter cards.

- Campaign:
  - on the Warband screen under the Campaign tab you can edit your campaign record.
  - you can play campaign battles and modify fighters with campaign rules.

- Battlegrounds:
  - you can navigate to the Battlegrounds screen from the Main screen by pressing the Battlegrounds option in the menu.
  - on the Battlegrounds screen:
    - the screen title is the battleground's name.
    - the default battleground is the Universal Abilities as it is used in every battle.
    - you can add abilities to the selected battleground.
    - you can remove the selected battleground, if it is not the Universal abilities.
    - in the menu:
      - you can select a battleground by pressing on the Select Battleground option, then pressing on the chosen battleground name.
      - you can create a new battleground by pressing on the Select Battleground option, then pressing on the Add Battleground option.
      - you can import/export battlegrounds.

- Battle dialog:
  - in the Main screen menu you can open the Battle dialog by pressing on Quick Battle.
  - in the Warband screen menu you can open the Battle dialog by pressing on Prepare for Battle.
  - before starting a new battle you can select which battlegrounds apply to the battle.
  - if you initiated the battle with a selected warband you can decide to play a campaign match.
  - if there is a previously not finished battle you can continue it by pressing Continue Previous Battle, or abort it and start a new battle instead by pressing New Battle.

- Battle:
  - in the Preparation phase:
    - you can drag Fighter cards in the selected groups by pressing and holding their point values.
    - in the menu you can:
      - add a new fighter to the roster with the Fighter dialog.
      - begin the battle.
      - abort the battle, losing all progress.
  - in the Battle phase:
    - you can see your current turn.
    - you can note down your current number of victory points.
    - you can manage your fighters with their Fighter cards.
    - in the menu you can:
      - end the turn.
      - end the battle.
      - add a wild fighter with the Fighter dialog.
      - abort the battle, losing all progress.

- End Battle dialog & Battle Logs:
  - on the Battle screen in the Battle phase you can open the Battle Results dialog by pressing End Battle in the menu.
  - the dialog form contains the following fields:
    - Claim Victory: if you have won the battle you need to enable this slide toggle.
    - Opposing Warband: this is the name of the enemy warband that you have fought.
  - after the battle you can check your previous battle outcomes on the Warband screen, by selecting the Battle Logs option in the menu. This option is only available after ending your first battle. Aborting a battle will not create a log.

- Settings:
  - in the Main screen menu you can:
    - toggle the background effects.
    - select the application theme.
    - choose the application language.
    - navigate to the GitHub page of the project.

</details>
