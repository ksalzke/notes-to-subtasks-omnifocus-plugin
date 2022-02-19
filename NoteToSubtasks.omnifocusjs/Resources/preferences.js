/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const preferences = this.noteToSubtasksLib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const checklistTag = this.noteToSubtasksLib.getChecklistTag()
    const expandableTag = this.noteToSubtasksLib.getExpandableTag()
    const uninheritedTags = this.noteToSubtasksLib.getUninheritedTags()
    const tagsToRemove = this.noteToSubtasksLib.getTagsToRemove()

    // create and show form
    const form = new Form()

    const checklistTagField = new Form.Field.Option('checklistTagID', 'Checklist Tag', flattenedTags, flattenedTags.map(t => t.name), checklistTag)
    checklistTagField.allowsNull = true
    checklistTagField.nullOptionTitle = 'None'
    form.addField(checklistTagField)

    const expandableTagField = new Form.Field.Option('expandableTagID', 'Expandable Tag', flattenedTags, flattenedTags.map(t => t.name), expandableTag)
    expandableTagField.allowsNull = true
    expandableTagField.nullOptionTitle = 'None'
    form.addField(expandableTagField)

    form.addField(new Form.Field.MultipleOptions('uninheritedTags', 'Uninherited Tags', flattenedTags, flattenedTags.map(t => t.name), uninheritedTags))
    form.addField(new Form.Field.MultipleOptions('tagsToRemove', 'Tags To Remove From Skipped Task When Expanding', flattenedTags, flattenedTags.map(t => t.name), tagsToRemove))

    await form.show('Preferences: Note To Subtasks', 'OK')

    // save preferences
    if (form.values.checklistTagID !== null) preferences.write('checklistTagID', form.values.checklistTagID.id.primaryKey)
    preferences.write('uninheritedTagIDs', form.values.uninheritedTags.map(t => t.id.primaryKey))
    preferences.write('tagsToRemoveIDs', form.values.tagsToRemove.map(t => t.id.primaryKey))
    if (form.values.expandableTagID !== null) preferences.write('expandableTagID', form.values.expandableTagID.id.primaryKey)
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
