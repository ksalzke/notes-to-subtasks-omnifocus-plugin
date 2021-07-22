/* global PlugIn Version duplicateTasks Pasteboard copyTasksToPasteboard deleteObject moveTasks TypeIdentifier pasteTasksFromPasteboard */
(() => {
  const functionLibrary = new PlugIn.Library(new Version('1.0'))

  functionLibrary.noteToSubtasks = function (task) {
    // configuration
    const config = PlugIn.find('com.KaitlinSalzke.noteToSubtasks').library(
      'noteToSubtasksConfig'
    )
    const checklistTagName = config.checklistTagName()
    const uninheritedTags = config.uninheritedTags()

    // stop if no TaskPaper found
    const regex = /^.*?(?=_*\[\s\]|_*-\s)/gs
    if (!regex.test(task.note)) {
      return
    }

    // if task is a repeating task, duplicate and drop before expanding the new task
    const nTask = duplicateTasks([task], task.before)[0]
    nTask.repetitionRule = null
    task.drop(false)
    task = nTask

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

    // create list of tags from original task
    const tagArray = []
    task.tags.forEach(function (tag) {
      if (!uninheritedTags.includes(tag)) {
        tagArray.push(tag.name)
      }
    })
    const tagList = tagArray.join(', ')

    // add parent & checklist tags (where there are existing tags on line in taskpaper)
    taskpaper = taskpaper.replace(
      /@tags\((.+)\)/gm,
      `@tags($1, ${checklistTagName}, ${tagList})`
    )

    // add parent & checklist tags (where there aren't any exsting tags on line in taskpaper)
    taskpaper = taskpaper.replace(
      /(^((?!@tags).)*$)/gm,
      `$1 @tags(${checklistTagName},${tagList})`
    )

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

    // check if there is only one subtask now and if so expand it too
    if (task.children.length === 1) {
      this.noteToSubtasks(task.children[0])
    }
  }

  functionLibrary.collapseSubtasks = function (task) {
    const tempPasteboard = Pasteboard.makeUnique()

    copyTasksToPasteboard(task.children, tempPasteboard)
    task.note = tempPasteboard.string

    task.children.forEach(child => deleteObject(child))
  }

  return functionLibrary
})()
