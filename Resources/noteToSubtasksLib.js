/* global PlugIn Version Tag duplicateTasks Pasteboard copyTasksToPasteboard deleteObject moveTasks TypeIdentifier pasteTasksFromPasteboard Alert */
(() => {
  const lib = new PlugIn.Library(new Version('1.0'))

  lib.loadSyncedPrefs = () => {
    const syncedPrefsPlugin = PlugIn.find('com.KaitlinSalzke.SyncedPrefLibrary')

    if (syncedPrefsPlugin !== null) {
      const SyncedPref = syncedPrefsPlugin.library('syncedPrefLibrary').SyncedPref
      return new SyncedPref('com.KaitlinSalzke.noteToSubtasks')
    } else {
      const alert = new Alert(
        'Synced Preferences Library Required',
        'For the Note To Subtasks plug-in to work correctly, the \'Synced Preferences for OmniFocus\' plugin (https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately. Either you do not currently have this plugin installed, or it is not installed correctly.'
      )
      alert.show()
    }
  }

  lib.getChecklistTag = () => {
    const preferences = lib.loadSyncedPrefs()
    const id = preferences.read('checklistTagID')
    return (id === null) ? null : Tag.byIdentifier(id)
  }

  lib.templateToSubtasks = async function (task, templateName) {
    const templateLib = PlugIn.find('com.KaitlinSalzke.Templates').library('templateLibrary')

    if (templateLib !== null) {
      const templateFolder = await templateLib.getTemplateFolder()
      const template = templateFolder.flattenedProjects.find(project => project.name === templateName)
      templateLib.createFromTemplate(template, task)
    } else {
      const alert = new Alert('Templates Not Installed', 'Trying to create from template but Templates plugin is not installed. Find at https://github.com/ksalzke/templates-for-omnifocus')
      alert.show()
    }
  }

  lib.noteToSubtasks = function (task) {
    // configuration
    const config = PlugIn.find('com.KaitlinSalzke.noteToSubtasks').library(
      'noteToSubtasksConfig'
    )
    const checklistTag = lib.getChecklistTag()
    const uninheritedTags = config.uninheritedTags()

    // if task is a repeating task, duplicate and drop before expanding the new task
    const nTask = duplicateTasks([task], task.before)[0]
    nTask.repetitionRule = null
    task.drop(false)
    task = nTask

    // create from template if applicable
    const templateNameMatch = task.note.match(/\$TEMPLATE=(.*?)$/)
    if (templateNameMatch !== null) {
      lib.templateToSubtasks(task, templateNameMatch[1])
      tagSubtasks(task)
      return
    }

    // stop if no TaskPaper and no template found
    const regex = /^.*?(?=_*\[\s\]|_*-\s)/gs
    if (!regex.test(task.note)) {
      return
    }

    // mark parent task as completed when all children are completed
    task.completedByChildren = true

    // ignore everything up to first '[ ]' or '- ' or '_'' in TaskPaper
    let taskpaper = task.note.replace(regex, '')

    // get note and replace underscores before "[" with tabs -- needed because Shortcut removes tabs from Drafts template
    taskpaper = taskpaper.replace(/(_)+(?=\[)/g, function (match) {
      const underscoreLength = match.length
      const replacement = '\t'.repeat(underscoreLength)
      return replacement
    })

    // replace '[ ]' with '-'
    taskpaper = taskpaper.replace(/\[\s\]/g, ' - ')

    // function to add tags
    function tagSubtasks (parentTask) {
      const tagsToAdd = parentTask.tags.filter(tag => !uninheritedTags.includes(tag))
      if (checklistTag !== null) tagsToAdd.push(checklistTag)
      parentTask.flattenedTasks.forEach(subtask => subtask.addTags(tagsToAdd))
    }

    // replace '( )' with '[ ]'
    taskpaper = taskpaper.replace(/\(\s\)/g, '[ ]')

    // replace '< >' with '( )'
    taskpaper = taskpaper.replace(/<\s>/g, '( )')

    // create subtasks
    const subtaskPasteboard = Pasteboard.makeUnique()
    const subtasks = new Pasteboard.Item()
    subtasks.setStringForType(taskpaper, TypeIdentifier.taskPaper)
    subtaskPasteboard.addItems([subtasks])
    const newTasks = pasteTasksFromPasteboard(subtaskPasteboard)
    moveTasks(newTasks, task.ending)

    // add tags
    tagSubtasks(task)

    // check if there is only one subtask now and if so expand it too
    if (task.children.length === 1) {
      this.noteToSubtasks(task.children[0])
    }
  }

  lib.collapseSubtasks = function (task) {
    // make sure parent task isn't set to autocomplete so that it isn't marked complete when collapsed
    task.completedByChildren = false

    const tempPasteboard = Pasteboard.makeUnique()
    copyTasksToPasteboard(task.children, tempPasteboard)
    task.note = tempPasteboard.string

    task.children.forEach(child => deleteObject(child))
  }

  return lib
})()
