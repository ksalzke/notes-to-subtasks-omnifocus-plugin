/* global PlugIn */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    selection.tasks.forEach(task => this.noteToSubtasksLib.collapseSubtasks(task))
  })

  action.validate = (selection, sender) => {
    return selection.tasks.length > 0
  }

  return action
})()
