module.exports = {
  ok () {
    return 'OK'
  },
  cancel () {
    return 'Abbrechen'
  },
  add (item = '') {
    return `${item ? `Füge '${item}' hinzu` : 'hinzufügen'}`
  },
  selectNone () {
    return 'Wähle nichts aus'
  },
  clear () {
    return 'Löschen'
  },
  notFound () {
    return 'Nichts gefunden!'
  },
  search () {
    return 'Suche...'
  },
  browse () {
    return 'Durchsuche...'
  },
  nFileSelected (n = 1) {
    if (n === 1) {
      return '1 Datei wird ausgewählt!'
    }
    return `${n} Dateien werden ausgewählt!`
  },
  nextPage () {
    return 'Nächste'
  },
  prevPage () {
    return 'Vorherige'
  },
  fromN (n = 1) {
    return `von ${n}`
  }
}
