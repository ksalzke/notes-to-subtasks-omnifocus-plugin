(() => {
  var noteToSubtasksConfig = new PlugIn.Library(new Version("1.0"));

  noteToSubtasksConfig.checklistTagName = function () {
    // The name of the tag that subtasks are tagged with
    // THIS SHOULD BE A STRING
    return "✓";
  };

  noteToSubtasksConfig.uninheritedTags = function () {
    // The tags that shouldn't be inherited by the subtasks
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    uninheritedTags = [];

    // If you are not me, you can safely delete the following section (or tweak it to match your own setup)
    if (PlugIn.find("com.KaitlinSalzke.config") !== null) {
      uninheritedTags = PlugIn.find("com.KaitlinSalzke.config")
        .library("configLibrary")
        .uninheritedTags();
    }
    return uninheritedTags;
  };

  return noteToSubtasksConfig;
})();
