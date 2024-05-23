import React, { useState, useEffect } from "react";

// create component
export default function NewQuery() { 

    // create empty object to store query results
    const [nodeNames, setNodeNames] = useState([]);

    // execute query on page reload
    useEffect(() => {
        fetch("/api/newQuery")
            .then((res) => res.json())
            .then((data) => {
                const names = data.map((item) => item.properties.name); // extract just names
                setNodeNames(names);
            })
            .catch((error) => {
                console.error("Error fetching network data:", error);
            });
    }, []);

    // display the node names in the console (right click and inspect element)
    console.log(nodeNames);

    // Function for submitting the query
    async function handleNewQuery(e) {
        setNodeNames([]); // reset upon execution
        e.preventDefault(); // prevent default form submission

        // copied exactly from the useEffect statement
        fetch("/api/newQuery")
            .then((res) => res.json())
            .then((data) => {
                const names = data.map((item) => item.properties.name);
                setNodeNames(names);
            })
            .catch((error) => {
                console.error("Error fetching network data:", error);
            });

        // functions must return something, since we executed everything and assigned node names already we just return
        return;
    }

    return (
        <div>
            <button onClick={handleNewQuery}>{nodeNames.map((name, index) => (
                <p key={index}>{index + 1}: {name}</p>
            ))}</button>
        </div>
    );

};