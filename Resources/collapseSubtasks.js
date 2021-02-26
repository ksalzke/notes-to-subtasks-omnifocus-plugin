/* global PlugIn */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    this.noteToSubtasksLib.collapseSubtasks(selection.tasks[0])
  })

  action.validate = (selection, sender) => {
    return selection.tasks.length === 1
  }

  return action
})()
