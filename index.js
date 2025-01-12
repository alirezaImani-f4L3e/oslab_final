const express = require('express')
const { exec } = require("child_process")
const app = express()
const port = 3000

const commandsMapping = {
    "cpu_info": "lscpu",
    "os_info": "uname -a",
    "gcc_info": 'gcc --version 2>/dev/null || echo "gcc has not installed"',
    "load_info": "uptime",
    "process_count": "ps -e --no-headers | wc -l",
    "top_10_processes": "ps -eo pid,comm,%mem --sort=-%mem | head -n 10",
    "users_info": "who",
    "groups_info": "getent group | cut -d: -f1",
    "services_info": "systemctl list-units --type=service --state=active",
    "installed_apps": "dpkg -l",
    "processor_info": "lscpu",
    "memory_info": "free -h",
    "network_cards_info": "ip -brief link",
    "displays_info": 'xrandr --listmonitors 2>/dev/null || echo "No display connected"'
}


app.use(express.static('public'))

app.get('/api', (req, res) => {
    if (!commandsMapping[req.query.section]) return res.send("Command is not valid");

    exec(commandsMapping[req.query.section], (error, stdout, stderr) => {
        if (error) {
            res.send("command failed. here is the error message:\n" + error)
        }
        if (stderr) {
            res.send("command failed. here is the error message:\n" + stderr)
        }
        res.send(stdout)
    });
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})