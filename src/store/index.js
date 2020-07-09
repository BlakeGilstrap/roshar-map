import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function calculateNextOffset (event, lastEvent) {
  if (event.date[0] - lastEvent.date[0] >= 100) {
    return 500
  }

  if (event.date[0] - lastEvent.date[0] >= 5) {
    return 200
  }

  if (event.date[0] - lastEvent.date[0] >= 1) {
    return (event.date[0] - lastEvent.date[0]) * 60
  }

  return 50
}

const events = [
  {
    date: [-10000],
    name: 'Shattering of Adonalsium',
    tags: ['general'],
    shadesmar: false,
    specialEffect: 'shattering',
    coordinates: {
      x: 512,
      y: 256,
      zoom: 0
    }
  },
  {
    date: [-8000],
    name: 'Human Exodus from Ashyn',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 512,
      y: 256,
      zoom: 0
    }
  },
  {
    date: [-3300],
    name: 'The Last Desolation',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 512,
      y: 256,
      zoom: 0
    }
  },
  {
    date: [-800],
    name: 'The False Desolation',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 512,
      y: 256,
      zoom: 0
    }
  },
  {
    date: [650],
    name: 'End of the Hierocracy',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 512,
      y: 256,
      zoom: 0
    }
  },
  {
    date: [975],
    name: 'Scouring of Amia',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 512,
      y: 256,
      zoom: 0
    }
  },
  {
    year: 1120,
    date: [1120],
    name: 'Dalinar is born',
    tags: ['dalinar'],
    shadesmar: false,
    coordinates: {
      x: 769,
      y: 249
    }
  },
  {
    date: [1153],
    name: 'Kaladin is born',
    image: {
      file: 'kaladin.jpg',
      offset: {
        x: '90%',
        y: '0'
      },
      size: '150%'
    },
    tags: ['kaladin'],
    shadesmar: false,
    coordinates: {
      x: 765,
      y: 188
    }
  },
  {
    date: [1156],
    name: 'Shallan is born',
    tags: ['shallan'],
    shadesmar: false,
    coordinates: {
      x: 642,
      y: 255
    }
  },
  {
    date: [1163],
    name: 'Return to the Rift. Evi dies.',
    tags: ['dalinar'],
    shadesmar: false,
    coordinates: {
      x: 756,
      y: 311
    }
  },
  {
    date: [1169, 1],
    name: 'Taravangian visits the Nightwatcher',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 756,
      y: 311
    }
  },
  {
    date: [1169, 4],
    name: 'Tien dies',
    tags: ['kaladin'],
    shadesmar: false,
    coordinates: {
      x: 756,
      y: 311
    }
  },
  {
    date: [1169, 10],
    name: 'Lin Davar accused of murder',
    tags: ['general'],
    shadesmar: false,
    coordinates: {
      x: 756,
      y: 311
    }
  },
  {
    date: [1174],
    name: 'The gang is in Shadesmar',
    tags: ['kaladin', 'shallan'],
    shadesmar: true,
    coordinates: {
      x: 769,
      y: 249
    }
  }
].sort(
  (a, b) => {
    let j = 0

    for (let i = 0; i < a.date.length; i++) {
      if (j === b.date.length - 1 && b.date[j] !== a.date[i]) {
        return a.date[i] - b.date[j]
      }

      if (a.date[i] !== b.date[j]) {
        return a.date[i] - b.date[j]
      }

      j += 1
    }

    if (j !== b.date.length) {
      return -1
    }

    if (a.tieBreaker !== undefined && b.tieBreaker !== undefined) {
      return a.tieBreaker - b.tieBreaker
    } else if (a.tieBreaker !== undefined) {
      return 1
    }

    return -1
  }).map((event, index) => ({ ...event, id: index }))

let lastEvent = null
let runningOffset = 0
events.forEach((event) => {
  if (lastEvent !== null) {
    runningOffset += calculateNextOffset(event, lastEvent)
  }

  // eslint-disable-next-line no-param-reassign
  event.offset = runningOffset

  lastEvent = event
})

export default new Vuex.Store({
  state: {
    events,
    details: null,
    filter: {
      tags: null,
      breakoutTags: []
    }
  },
  mutations: {
    showDetails (state) {
      state.details = {}
    },
    closeDetails (state) {
      state.details = null
    },
    toggleTag (state, tag) {
      if (state.filter.tags === null) {
        state.filter.tags = [tag]
      } else {
        const index = state.filter.tags.indexOf(tag)

        if (index === -1) {
          state.filter.tags.push(tag)
        } else {
          state.filter.tags.splice(index, 1)
        }
      }

      if (state.filter.tags.length === 0) {
        state.filter.tags = null
      }
    }
  },
  getters: {
    isDisabled (state) {
      return (event) => {
        return state.filter.tags !== null ? !state.filter.tags.some(t => event.tags.includes(t)) : false
      }
    }
  }
})
