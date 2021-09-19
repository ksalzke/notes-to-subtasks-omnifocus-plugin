# About

This is an Omni Automation plug-in bundle for OmniFocus that provides a function and action to 'expand' a TaskPaper note into subtasks; it is designed with "checklist" items in mind.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

## Known issues 

None so far! 🤞

# Installation & Set-Up

1. Click on the green `Clone or download` button above to download a `.zip` file of all the files in this GitHub repository.
2. Unzip the downloaded file.
3. Open the configuration file located at `Resources/noteToSubtasksConfig.js` and make any changes needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Rename the entire folder to anything you like, with the extension `.omnifocusjs`
5. Move the resulting file to your OmniFocus plug-in library folder.

# Actions

This plug-in contains the following action:

## Note To Subtasks

This action simply runs the below `noteToSubtasks` function on the selected task.

## Collapse Subtasks

This action simply runs the below `noteToSubtasks` function on the selected task(s).

# Functions

This plugin contains the following function within the `noteToSubtasksLib` library:

## templateToSubtasks

This function tasks a task and a template project name as input and uses my [Templates For OmniFocus](https://github.com/ksalzke/templates-for-omnifocus) plug-in to insert the template as a subtask. (Note that not all more advanced features are fully supported, but basic use of placeholders should work correctly. )

## noteToSubtasks

This function takes a task object as input and, if there is a template specified in the note in the format `$TEMPLATE=Name of Template Project`, runs the `templateToSubtasks` action above. Otherwise, it:
1. Builds the TaskPaper text to be used to create subtasks of that task.
2. Creates the subtasks by "pasting" the generated TaskPaper into OmniFocus.
3. If only one subtask is created, recursively runs on the created subtask as well.

Subtasks are tagged with:
* any tags that the original task is tagged with, _unless_ they are included in the `uninheritedTags` option in the config file,
* a checklist tag (which defaults to `✓` and is set in the config file), and
* any tags specified in the regular TaskPaper format

To allow for multiple iterations of checklists, there are three 'levels' of 'task markers':
1. `- ` or `[ ]` will be expanded the first time the function is run
2. `( )` will be expanded the second time the function is run
3. `< >` will be expanded the third time the function is run

In the process of creating the TaskPaper text, this function:
* Ignores everything up to the first `[ ]`, `- `, or `_` in the note
* Replaces underscores before `[ ` with tabs (this is to assist with Taskpaper generated from Shortcuts, as Shortcuts doesn't retain the tab characters)

In both cases, repeating tasks are _skipped_ before expanding.

## collapseSubtasks

Given a task, this function: 
1. Ensures the task is not set to autocomplete with children.
2. Sets the note of the given task to the children of the task in TaskPaper format.
3. Deletes the subtasks.

The task can then subsequently be expanded using the `noteToSubtasks` function.