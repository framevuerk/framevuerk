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
  dateDisplayFormat () {
    return 'D/M/Y, HH:mm'
  },
  second () {
    return 'Sekunde'
  },
  minute () {
    return 'Minute'
  },
  hour () {
    return 'Stunde'
  },
  day () {
    return 'Tag'
  },
  week () {
    return 'Woche'
  },
  month () {
    return 'Monat'
  },
  year () {
    return 'Jahre'
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
