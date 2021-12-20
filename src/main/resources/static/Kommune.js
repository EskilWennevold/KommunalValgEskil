


sessionStorage.setItem("SERVER_URL","api/kommunalvalg");
const SERVER_URL = sessionStorage.getItem("SERVER_URL");


    function setUpClickEvents() {
        document.getElementById("medlem-body").onclick = handleTableClick
        document.getElementById("btn-save").onclick = saveMedlem
        document.getElementById("btn-add-medlem").onclick = makeNewMedlem
        document.getElementById("select-filter").onchange = filterByParti
        document.getElementById("btn-show-chart").onclick = showChart
    }


    function showChart(){
        // Diagrammet og metoderne er taget fra https://canvasjs.com/html5-javascript-pie-chart/
        let coordArray = findCoords()
        let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Kommunalvalget For hvert Parti - 2021"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: coordArray
            }]
        });
        chart.render();
    }
    function findParties(){
        let array = cache.getAll()
        let myPartiSet = new Set();
        for(let i = 0; i < array.length; i++){
            myPartiSet.add(array[i].parti)
        }
        newArray = Array.from(myPartiSet)
        return newArray;
    }
    function findCoords(){
        let partiArray = findParties()
        let allVotes = getAllVotes()

        let coordsArray = [];
        let cachen = cache.getAll()

        let sum = 0;
        for(let i = 0; i < partiArray.length; i++){
            for (let j = 0; j < cachen.length; j++){
                if(cachen[j].parti == partiArray[i]){
                    sum += cachen[j].stemmer
                }
            }
            let coord = {}
            coord.label = partiArray[i]
            coord.y = sum;
            coordsArray.push(coord)
            sum = 0
        }
        return percentageArray(allVotes, coordsArray)

    }
    function percentageArray(allVotes,coordsArray){
        coordsArray.forEach(c => {
            c.y = Math.round(c.y/allVotes*100)
        })
        return coordsArray;
    }
    function getAllVotes(){
        let array = cache.getAll()
        let sum = 0;
        for (let i = 0; i < array.length; i++){
            sum += array[i].stemmer
        }
        return sum;
    }
    function filterByParti(){
        let value = document.getElementById("select-filter").value;

        console.log(value)
        if(value == "Alle"){
            makeRows()
        } else {
            let filteredCandidates = cache.getAll().filter(c => c.parti === value)
            console.log(filteredCandidates)
            rows = filteredCandidates.map(m =>`
            <tr>
               <td>${m.id}</td>
               <td>${m.navn}</td>
               <td>${m.parti}</td>
               <td>${m.stemmer}</td>
               <td><a data-id-delete=${m.id}  href="#">Fjern</td>
               <td><a data-id-edit='${m.id}' href="#">Rediger</a> </td>
            </tr>
            `)
                document.getElementById("medlem-body").innerHTML = rows.join("")
        }
    }
    function makeNewMedlem() {
        showModal({
            id: null,
            navn: "",
            parti: "",
            stemmer: ""
        })
    }
    function saveMedlem() {
        const medlem = {}
        medlem.id = Number(document.getElementById("medlems-id").innerText)
        medlem.navn = document.getElementById("input-navn").value
        medlem.parti = document.getElementById("input-parti").value
        medlem.stemmer = document.getElementById("input-stemmer").value

        const method = medlem.id ? "PUT" : "POST"
        const url = method === "PUT" ? SERVER_URL + "/" + medlem.id : SERVER_URL
        const options = {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medlem)
        }
        fetch(url, options)
            .then(res =>{
                if (!res.ok) {
                    throw "Der er sket en input fejl"
                }
                return res.json()
            })
            .then(medlem=>{
                cache.addEdit(medlem,method)
                makeRows()
            })
            .catch(e => alert(e))
    }
    setUpClickEvents()
    function handleTableClick(event){
        event.preventDefault()
        event.stopPropagation()
        const medlem = event.target;

        if (medlem.dataset.idDelete) {
            const id = Number(medlem.dataset.idDelete)
            console.log(id)
            const option = {
                method: "DELETE",
                headers: {'Accept': 'application/json'}
            }
            fetch(SERVER_URL+"/"+id,option)
                .then(res => {
                    if(res.ok) {
                        cache.deleteOne(id)
                        makeRows()
                    }
                })
        }
        if (medlem.dataset.idEdit) {
            let idToEdit = Number(medlem.dataset.idEdit)
            let medlemEdit = cache.findById(idToEdit)
            showModal(medlemEdit)
        }
    }
    function showModal(medlem) {
        const myModal = new bootstrap.Modal(document.getElementById('medlems-modal'))
        document.getElementById("modal-title").innerText = medlem.id ? "Rediger Medlem" : "Tilføj Medlem"
        document.getElementById("medlems-id").innerText = medlem.id
        document.getElementById("input-navn").value = medlem.navn
        document.getElementById("input-parti").value = medlem.parti
        document.getElementById("input-stemmer").value = medlem.stemmer
        myModal.show()
    }
    function Cache() {
        let medlemmer = []
        const addEdit = (medlem, method) => {
            if (method === "POST") {
                medlemmer.push(medlem)
            } else if (method === "PUT") {
                medlemmer = medlemmer.map(m => m.id == medlem.id ? medlem : m)
            }
        }
        return {
            getAll: () => medlemmer,
            addAll: (all) => medlemmer = all,
            deleteOne: (id) => medlemmer = medlemmer.filter(m => m.id !== Number(id)),
            findById: (id) => medlemmer.find(m => m.id == id),
            addEdit: addEdit
        }
    }
    function fetchMedlemmer(){
        fetch(SERVER_URL)
            .then(res => res.json())
            .then(data => {
                cache.addAll(data)
                makeRows()
            })
    }
    function makeRows(){
        let medlemmer = cache.getAll()
        let rows = medlemmer.map(m =>`
        <tr>
           <td>${m.id}</td>
           <td>${m.navn}</td>
           <td>${m.parti}</td>
           <td>${m.stemmer}</td>
           <td><a data-id-delete=${m.id}  href="#">Fjern</td>
           <td><a data-id-edit='${m.id}' href="#">Rediger</a> </td>
        </tr>
        `)
        document.getElementById("medlem-body").innerHTML = rows.join("")
    }

    let cache = Cache();
    fetchMedlemmer()