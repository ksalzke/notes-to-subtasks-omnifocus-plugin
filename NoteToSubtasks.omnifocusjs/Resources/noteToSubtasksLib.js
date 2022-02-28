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
        'For the Note To Subtasks plug-in to work correctly, the \'Synced Preferences for OmniFocus\' plug-in (https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately. Either you do not currently have this plug-in installed, or it is not installed correctly.'
      )
      alert.show()
    }
  }

  lib.getChecklistTag = () => {
    const preferences = lib.loadSyncedPrefs()
    const id = preferences.read('checklistTagID')
    return (id === null) ? null : Tag.byIdentifier(id)
  }

  lib.getExpandableTag = () => {
    const preferences = lib.loadSyncedPrefs()
    const id = preferences.read('expandableTagID')
    return (id === null) ? null : Tag.byIdentifier(id)
  }

  lib.getUninheritedTags = () => {
    const preferences = lib.loadSyncedPrefs()
    return (preferences.read('uninheritedTagIDs') !== null) ? preferences.read('uninheritedTagIDs').map(id => Tag.byIdentifier(id)).filter(tag => tag !== null) : []
  }

  lib.getTagsToRemove = () => {
    const preferences = lib.loadSyncedPrefs()
    return (preferences.read('tagsToRemoveIDs') !== null) ? preferences.read('tagsToRemoveIDs').map(id => Tag.byIdentifier(id)).filter(tag => tag !== null) : []
  }

  lib.templateToSubtasks = async function (task, templateName) {
    const templateLib = PlugIn.find('com.KaitlinSalzke.Templates').library('templateLibrary')

    if (templateLib !== null) {
      const templateFolder = await templateLib.getTemplateFolder()
      const template = templateFolder.flattenedProjects.find(project => project.name === templateName)
      templateLib.createFromTemplate(template, task)
    } else {
      const alert = new Alert('Templates Not Installed', 'Trying to create from template but Templates plug-in is not installed. Find at https://github.com/ksalzke/templates-for-omnifocus')
      alert.show()
    }
  }

  lib.noteToSubtasks = function (task) {
    const checklistTag = lib.getChecklistTag()
    const uninheritedTags = lib.getUninheritedTags()
    const tagsToRemove = lib.getTagsToRemove()

    // function to add checklist tag and remove uninherited tags
    const tagSubtasks = (task) => task.flattenedTasks.forEach(subtask => {
      if (checklistTag !== null) subtask.addTag(checklistTag)
      subtask.addTags(task.tags)
      subtask.removeTags(uninheritedTags)
    })

    // if task is a repeating task, duplicate and drop before expanding the new task
    if (task.repetitionRule !== null) {
      const nTask = duplicateTasks([task], task.before)[0]
      nTask.repetitionRule = null
      task.removeTags(tagsToRemove)
      task.drop(false)
      task = nTask
    }
    
    // mark parent task as completed when all children are completed
    task.completedByChildren = true

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

    // add checklist tag and remove uninherited tags
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

    if (lib.getExpandableTag() !== null) task.addTag(lib.getExpandableTag())

    task.children.forEach(child => deleteObject(child))
  }

  return lib
})()
