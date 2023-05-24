```bash=
mongo -u yourusername -p yourpassword

db.createRole({role: "serviceRole", privileges: [{resource: {db: 'noteflow', collection: ''}, actions: ['find', 'insert', 'update', 'remove']}], roles: [] })

db.createUser({ user: 'jounglab', pwd: '112a', roles: [ {role: 'serviceRole', db: 'noteflow'}] })
```