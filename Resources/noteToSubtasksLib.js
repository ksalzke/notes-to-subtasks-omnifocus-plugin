/* global PlugIn Version duplicateTasks Perspective Pasteboard copyTasksToPasteboard deleteObject */
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

    // get current perspective
    const startingPerspective = document.windows[0].perspective

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

    // build URL to paste tasks
    const pasteUrlStr =
      'omnifocus:///paste?target=/task/' +
      encodeURIComponent(task.id.primaryKey) +
      '&content=' +
      encodeURIComponent(taskpaper)

    // open URL (generating subtasks)
    URL.fromString(pasteUrlStr).call(() => {
      // check if there is only one subtask now and if so expand it too
      if (task.children.length === 1) {
        this.noteToSubtasks(task.children[0])
      }

      // return to starting perspective
      if (Perspective.BuiltIn.all.includes(startingPerspective)) {
        document.windows[0].perspective = startingPerspective
      } else {
        document.windows[0].perspective = Perspective.Custom.byName(startingPerspective.name)
      }
    })
  }

  functionLibrary.collapseSubtasks = function (task) {
    const tempPasteboard = Pasteboard.makeUnique()

    copyTasksToPasteboard(task.children, tempPasteboard)
    task.note = tempPasteboard.string

    task.children.forEach(child => deleteObject(child))
  }

  return functionLibrary
})()
