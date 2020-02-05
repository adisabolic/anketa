const { TaskTimer } = tasktimer;
function pokreniTajmer(trenutnoP) {
    const timer = new TaskTimer(1000);
    timer.add([
        {
            id: 'task-1',       // unique ID of the task
            tickInterval: trenutnoP.trajanje,    // run every 5 ticks (5 x interval = 5000 ms)
            totalRuns: 1,      // run 10 times only. (set to 0 for unlimited times)
            callback(task) {
                $('#odgovori').hide();
                console.log(`${task.id} task has run ${task.currentRuns} times.`);
                window.location = "/anketa/" + sifra + "/rezultati";
                timer.stop();
            }
        }
    ]);
    timer.on('tick', () => {
        $("#sekunde").val(1000 * (trenutnoP.trajanje - timer.tickCount));
    });
}