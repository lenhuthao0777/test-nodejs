const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const raceModel = require('./race.model')
const seasonModel = require('./season.model')
const teamModel = require('./team.model')
const driverModel = require('./driver.model')
const moment = require('moment')

dotenv.config()

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))

app.use(
  cors({
    origin: '*',
  })
)

app.use(morgan('dev'))

const url = 'https://www.formula1.com/en/results.html/2018/races.html'
const getHtml = async () => {
  const { data: html } = await axios.get(url).then((res) => res)
  return html
}

app.get('/v1/race', async (req, res) => {
  try {
    const { page, page_size, year } = req.query

    const size = await raceModel.find()

    const data = await raceModel
      .find()
      .skip((Number(page) - 1) * Number(page_size))
      .limit(Number(page_size))
      .exec()

    const ans = data.filter(
      (item) => moment(item.date).format('YYYY') === moment(year).format('YYYY')
    )

    return res.status(200).json({
      data: year ? ans : data,
      pagination: {
        page_size: Number(page_size),
        page: Number(page),
        total_page: year
          ? Math.ceil(ans.length / Number(page_size))
          : Math.ceil(size.length / Number(page_size)),
      },
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

app.post('/v1/race', async (req, res) => {
  try {
    const getData = []

    const html = await getHtml()

    const $ = cheerio.load(html)

    $('.table-wrap > .resultsarchive-table tbody tr').each((_, item) => {
      const grand_prix = $(item).find('td a').text()
      const date = $(item).find('td.dark.hide-for-mobile').text()
      const winner = $(item).find('td.dark.bold span').text()
      const car = $(item).find('td.semi-bold.uppercase').text()
      const laps = $(item).find('td.bold.hide-for-mobile').text()
      const time = $(item).find('td.dark.bold.hide-for-tablet').text()

      getData.push({
        grand_prix,
        date: moment(date),
        winner,
        car,
        laps,
        time,
      })
    })

    const b = async (data) => {
      const race = new raceModel({ ...data })
      await race.save()
    }

    for (item of getData) {
      b(item)
    }

    return res.status(201).json({ message: 'Create success!', getData })
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.post('/v1/team', async (req, res) => {
  try {
    const getData = []
    const html = await getHtml()
    const $ = cheerio.load(html)

    $('div.container.listing.team-listing .row .col-12.col-md-6').each(
      (i, item) => {
        const rank = $(item)
          .find('a .listing-item-wrapper .listing-item .listing-standing .rank')
          .text()

        const points = $(item)
          .find(
            'a .listing-item-wrapper .listing-item .listing-standing .points .f1-wide--s'
          )
          .text()

        const name = $(item)
          .find(
            'a .listing-item-wrapper .listing-item .listing-info .name .f1-color--black'
          )
          .text()

        const logo = $(item)
          .find(
            'a .listing-item-wrapper .listing-item .listing-info .logo picture img'
          )
          .attr('data-src')

        const image = $(item)
          .find(
            'a .listing-item-wrapper .listing-item .listing-image picture img'
          )
          .attr('data-src')
        getData.push({
          rank,
          name,
          logo,
          image,
          points: Math.floor(Math.random() * 300),
          season: '64847f1a5e165d3464061b31',
        })
      }
    )

    const saveItem = async (data) => {
      const team = new teamModel({ ...data })
      await team.save()
    }

    for (data of getData) {
      saveItem({ ...data })
    }
    return res.status(201).json({ message: 'Create success!' })
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.get('/v1/team', async (req, res) => {
  try {
    const data = await teamModel.find()
    return res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.post('/v1/season', async (req, res) => {
  try {
    const season = new seasonModel({ ...req.body })

    await season.save()
    return res.status(201).json({
      message: 'Create success!',
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.get('/v1/season', async (req, res) => {
  try {
    const data = await seasonModel.find()

    return res.status(200).json({
      data,
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.get('/v1/driver', async (req, res) => {
  try {
    const data = await driverModel.find()

    return res.status(200).json({
      data,
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})

// app.post('/v1/driver', async (req, res) => {
//   try {
//     const html = await getHtml()
//     const $ = cheerio.load(html)
//     const getData = []
//     const findId = (key) => {
//       switch (key) {
//         case 'Red Bull Racing':
//           return '648495ac49ff5572bf73407d'

//         case 'Aston Martin':
//           return '648495ac49ff5572bf73407f'

//         case 'Mercedes':
//           return '648495ac49ff5572bf73407e'

//         case 'Ferrari':
//           return '648495ac49ff5572bf734080'

//         case 'Alpine':
//           return '648495ac49ff5572bf734081'

//         case 'McLaren':
//           return '648495ac49ff5572bf734082'

//         case 'Haas F1 Team':
//           return '648495ac49ff5572bf734083'

//         case 'Alfa Romeo':
//           return '648495ac49ff5572bf734084'

//         case 'AlphaTauri':
//           return '648495ac49ff5572bf734085'

//         case 'Williams':
//           return '648495ac49ff5572bf734086'

//         default:
//           break
//       }
//     }

//     $('.container.driver .row .col-12.col-md-6').each((_, item) => {
//       const rank = $(item).find('a fieldset .listing-standing .rank').text()
//       const points = $(item)
//         .find('a fieldset .listing-standing .points .f1-wide--s')
//         .text()
//       const first = $(item)
//         .find(
//           'a fieldset .container .row .col-xs-8.listing-item--name.f1-uppercase .f1--xxs'
//         )
//         .text()
//       const last = $(item)
//         .find(
//           'a fieldset .container .row .col-xs-8.listing-item--name.f1-uppercase .f1-bold--s'
//         )
//         .text()

//       const flag = $(item)
//         .find(
//           'a fieldset .container .row .col-xs-4.country-flag .coutnry-flag--photo img'
//         )
//         .attr('data-src')

//       const car = $(item)
//         .find('a fieldset p.listing-item--team.f1--xxs.f1-color--gray5')
//         .text()

//       getData.push({
//         rank,
//         points,
//         name: first + ' ' + last,
//         flag,
//         car,
//         team: findId(car),
//       })
//     })

//     const saveData = async (data) => {
//       const a = new driverModel({ ...data })
//       await a.save()
//     }

//     for (item of getData) {
//       await saveData(item)
//     }

//     return res.status(201).json(getData)
//   } catch (error) {
//     return res.status(500).json(error)
//   }
// })

const DatabaseConnect = async () => {
  try {
    mongoose
      .connect(String(process.env.DB_URL))
      .then(() => console.log('Connect db success!'))
      .catch((error) => console.log(error))
  } catch (error) {
    console.log(error)
  }
}

DatabaseConnect()

app.listen(process.env.PORT || 3100, () =>
  console.log('app listen port', process.env.PORT)
)

const colorTeam = [
  '#3671C6',
  '#6CD3BF',
  '#358C75',
  '#F91536',
  '#2293D1',
  '#F58020',
  '#B6BABD',
  '#C92D4B',
  '#5E8FAA',
  '#37BEDD',
]
