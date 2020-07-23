import React from 'react'
import "./Map.css";
import {Map as Leafletmap, TileLayer} from "react-leaflet";
import {showDataOnMap} from "./util";

function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <Leafletmap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://osm.org/copyright">
                    OpenStreetMap</a> contributors'
                />
                {/* Loop through and draw circles on the screen */}
                {showDataOnMap(countries, casesType)}
            </Leafletmap>
        </div>
    )
}

export default Map;
