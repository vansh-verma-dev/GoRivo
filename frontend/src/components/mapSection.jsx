function MapSection() {
  return (
  <div className="h-full w-[65vw] overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 shadow-lg">
    <iframe  
    className="h-full w-full border-0"
     src="https://www.openstreetmap.org/export/embed.html?bbox=77.60%2C28.95%2C77.80%2C29.10&layer=mapnik" frameBorder="0"></iframe>
  </div>
  );
}

export default MapSection;