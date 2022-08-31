let express = require('express');
let router = express.Router();
let Scores = require('../classes/Scores');
let RequestAuthValidator = require('../classes/RequestAuthValidator');

const availableGames = ['tetris', 'snake'];

function scoresPage(req, res, next, game) {
    const isAdmin = req.query.auth && req.query.auth === 'tomasz';
    const responseType = req.get('accept');

    if (responseType && responseType.toLowerCase() === 'application/json') {
        if (!game || availableGames.indexOf(game) === -1) {
            res.status(422);
            res.send({
                error: 'bad data',
                message: 'Missing game info'
            });
        }

        res.send(Scores.instance.formatted(game));

    } else {
        res.render('scores', {
            game: game,
            data: Scores.instance.data[game],
            admin: isAdmin
        });
    }
}

// Friendly Solutions task data
let orders = {
  "exec_time": 0.11,
  "response": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 10,
    "to": 10,
    "total": 8,
    "data": [
      {
        "work_order_id": 1,
        "description": "Create a connection to SQL database using Excel",
        "received_date": "2021-07-21 00:23:03",
        "assigned_to": [
          {
            "person_name": "Technician One",
            "status": "Assigned"
          }
        ],
        "status": "New",
        "priority": "Low"
      },

      {
        "work_order_id": 2,
        "description": "Need to make update for laptop 11",
        "received_date": "2021-07-20 15:23:03",
        "assigned_to": [
          {
            "person_name": "Technician Two",
            "status": "Assigned"
          }
        ],
        "status": "New",
        "priority": "Low"
      },

      {
        "work_order_id": 3,
        "description": "Setup station 2",
        "received_date": "2021-07-20 14:23:03",
        "assigned_to": [
          {
            "person_name": "Technician One",
            "status": "In progress"
          }
        ],
        "status": "Confirmed",
        "priority": "High"
      },

      {
        "work_order_id": 4,
        "description": "Setup station 3",
        "received_date": "2021-07-19 12:23:03",
        "assigned_to": [
          {
            "person_name": "Technician Two",
            "status": "Assigned"
          },
          {
            "person_name": "Technician One",
            "status": "In progress"
          }
        ],
        "status": "Confirmed",
        "priority": "High"
      },

      {
        "work_order_id": 5,
        "description": "Mailbox issues",
        "received_date": "2021-07-19 11:23:03",
        "assigned_to": [
          {
            "person_name": "Technician Two",
            "status": "Confirmed"
          }
        ],
        "status": "Confirmed",
        "priority": "Normal"
      },

      {
        "work_order_id": 6,
        "description": "Subject: We sent you issue last Friday",
        "received_date": "2021-07-17 11:23:03",
        "assigned_to": [],
        "status": "New",
        "priority": "Low"
      },

      {
        "work_order_id": 7,
        "description": "Internal work",
        "received_date": "2021-07-17 10:23:03",
        "assigned_to": [],
        "status": "Canceled",
        "priority": "Low"
      },

      {
        "work_order_id": 8,
        "description": "Set up station for new user",
        "received_date": "2021-07-16 09:23:03",
        "assigned_to": [
          {
            "person_name": "Technician Two",
            "status": "Completed"
          }
        ],
        "status": "Completed",
        "priority": "Low"
      }
    ]
  }
};   

router.get('/orders', (req, res) => {
    res.send(JSON.stringify(orders));
});

router.get('/tetris', function (req, res, next) {
    return scoresPage(req, res, next, 'tetris');
});
router.get('/snake', function (req, res, next) {
    return scoresPage(req, res, next, 'snake');
});

router.post('/', function (req, res, next) {
    const validator = new RequestAuthValidator(req);

    if (!validator.validate()) {
        res.status(403);
        return res.send({
            error: 'auth',
            message: 'Unauthorized request'
        });

    } else if (
        !req.body.name || !req.body.score === undefined ||
        !req.body.game === undefined || availableGames.indexOf(req.body.game) === -1
    ) {
        res.status(422);
        res.send({
            error: 'bad data',
            message: 'Incomplete set of data received'
        });

    } else if (!req.body.score) {
        res.status(422);
        res.send({
            error: 'bad data',
            message: 'Try again with better score ;)'
        });

    } else {
        Scores.instance.add(req.body.game, {
            name: req.body.name,
            score: req.body.score,
            key: validator.getToken()
        });
        res.send(Scores.instance.formatted(req.body.game));
    }
});

module.exports = router;
