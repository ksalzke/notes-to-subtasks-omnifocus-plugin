# About

This is an Omni Automation plug-in bundle for OmniFocus that provides a function and action to 'expand' a TaskPaper note into subtasks; it is designed with "checklist" items in mind.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/issues) for known issues and planned changes/enhancements.

# Installation & Set-Up

**Important note: for this plug-in bundle to work correctly, my [Synced Preferences for OmniFocus plug-in](https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

1. Download the [latest release](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/releases/latest).
2. Unzip the downloaded file.
3. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).
4. Configure your preferences using the `Preferences` action. (Note that to run this action on iOS, no tasks can be selected.)

# Actions

This plug-in contains the following actions:

## Note To Subtasks

This action simply runs the below `noteToSubtasks` function on the selected task.

## Collapse Subtasks

This action simply runs the below `noteToSubtasks` function on the selected task(s).

## Preferences

This action allows the user to set the preferences for the plug-in. These sync between devices using the Synced Preferences plug-in linked above. Currently, the available preferences are:

* **Checklist Tag** If set, this tag will be added to each subtask (checklist item) when the note is expanded to subtasks.
* **Expandable Tag** If set, this tag will be added to the 'parent' task when subtasks are being collapsed, to indicate that the task can be 'expanded'.
* **Uninherited Tags** Tags that should not be inherited by the created subtasks, even if they are applied to the parent task.
* **Tags To Remove From Skipped Task When Expanding** Repeating tasks are 'skipped' prior to being expanded. This preferences specifies tags that should be removed from the original task (i.e. the next ocurrence).

# Functions

This plug-in contains the following function within the `noteToSubtasksLib` library:

## `loadSyncedPrefs () : SyncedPrefs`

Returns the [SyncedPref](https://github.com/ksalzke/synced-preferences-for-omnifocus) object for this plug-in.

## `getChecklistTag () : Tag`

This function returns the 'checklist tag' set in preferences, or null if none has been set.

## `getExpandableTag () : Tag`

This function returns the 'expandable tag' set in preferences, or null if none has been set.

## `getUninheritedTags () : Array<Tag>`

Returns an array containing all 'uninherited tags' set in preferences. If no uninherited tags have been set, an empty array is returned.

## `getTagsToRemove () : Array<Tag>`

Returns an array containing all 'Tags To Remove From Skipped Task When Expanding' set in preferences. If none have been set, an empty array is returned.

## `templateToSubtasks (task: Task, templateName: string)`

This asynchronous function tasks a task and a template project name as input and uses my [Templates For OmniFocus](https://github.com/ksalzke/templates-for-omnifocus) plug-in to insert the template as a subtask. (Note that not all more advanced features are fully supported, but basic use of placeholders should work correctly. )

## `noteToSubtasks (task: Task)`

This function takes a task object as input and, if there is a template specified in the note in the format `$TEMPLATE=Name of Template Project`, runs the `templateToSubtasks` action above. Otherwise, it:

1. Builds the TaskPaper text to be used to create subtasks of that task.
2. Creates the subtasks by "pasting" the generated TaskPaper into OmniFocus.
3. If only one subtask is created, recursively runs on the created subtask as well.

Subtasks inherit the tags of the parent tags, as well as:

* a 'checklist' tag, which can optionally be set in the preferences, and
* any tags specified in the regular TaskPaper format

Tags specified as 'uninherited tags' in the preferences are removed from subtasks.

To allow for multiple iterations of checklists, there are three 'levels' of 'task markers':

1. `- ` or `[ ]` will be expanded the first time the function is run
2. `( )` will be expanded the second time the function is run
3. `< >` will be expanded the third time the function is run

In the process of creating the TaskPaper text, this function:

* Ignores everything up to the first `[ ]`, `- `, or `_` in the note
* Replaces underscores before `[ ` with tabs (this is to assist with Taskpaper generated from Shortcuts, as Shortcuts doesn't retain the tab characters)

In both cases, repeating tasks are _skipped_ before expanding.

## `collapseSubtasks (task: Task)`

Given a task, this function: 
1. Ensures the task is not set to autocomplete with children.
2. Sets the note of the given task to the children of the task in TaskPaper format.
3. Adds the 'Expandable' tag (if one has been set in the preferences).
4. Deletes the subtasks.

The task can then subsequently be expanded using the `noteToSubtasks` function.