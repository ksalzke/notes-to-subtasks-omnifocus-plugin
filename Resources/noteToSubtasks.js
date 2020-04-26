(() => {
  var action = new PlugIn.Action(function (selection, sender) {
    functionLibrary = this.noteToSubtasksLib;
    functionLibrary.noteToSubtasks(selection.tasks[0]);
  });

  action.validate = function (selection, sender) {
    if (selection.tasks.length === 1) {
      return true;
    } else {
      return false;
    }
  };

  return action;
})();
