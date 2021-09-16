/* global PlugIn Version duplicateTasks Pasteboard copyTasksToPasteboard deleteObject moveTasks TypeIdentifier pasteTasksFromPasteboard Alert projectsMatching */
(() => {
  const functionLibrary = new PlugIn.Library(new Version('1.0'))

  functionLibrary.templateToSubtasks = function (task, template) {
    const templateLib = PlugIn.find('com.KaitlinSalzke.Templates').library('templateLibrary')

    if (templateLib !== null) {
      console.log('creating')
      console.log(template)
      console.log(task)
      templateLib.createFromTemplate(template, task)
    } else {
      const alert = new Alert('Templates Not Installed', 'Trying to create from template but Templates plugin is not installed. Find at https://github.com/ksalzke/templates-for-omnifocus')
      alert.show()
    }
  }

  functionLibrary.noteToSubtasks = function (task) {
    // configuration
    const config = PlugIn.find('com.KaitlinSalzke.noteToSubtasks').library(
      'noteToSubtasksConfig'
    )
    const checklistTag = config.checklistTag()
    const uninheritedTags = config.uninheritedTags()

    // if task is a repeating task, duplicate and drop before expanding the new task
    const nTask = duplicateTasks([task], task.before)[0]
    nTask.repetitionRule = null
    task.drop(false)
    task = nTask

    // create from template if applicable
    const templateNameMatch = task.note.match(/\$TEMPLATE=(.*?)$/)
    if (templateNameMatch !== null) {
      functionLibrary.templateToSubtasks(task, projectsMatching(templateNameMatch[1])[0])
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
      parentTask.flattenedTasks.forEach(subtask => subtask.addTags([checklistTag, ...tagsToAdd]))
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

  functionLibrary.collapseSubtasks = function (task) {
    // make sure parent task isn't set to autocomplete so that it isn't marked complete when collapsed
    task.completedByChildren = false

    const tempPasteboard = Pasteboard.makeUnique()
    copyTasksToPasteboard(task.children, tempPasteboard)
    task.note = tempPasteboard.string

    task.children.forEach(child => deleteObject(child))
  }

  return functionLibrary
})()
