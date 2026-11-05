import { useEffect, useState } from "react";

function LocationInput({ id, value, onChange, onSelect, placeholder }) {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || value.trim().length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=in&q=${encodeURIComponent(value)}`,
          { signal: controller.signal }
        );
        setResults(await res.json());
      } catch {
         
      }
    }, 500);  

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, open]);

  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl bg-gray-100 px-4 py-3.5 text-base text-gray-900 outline-none ring-2 ring-transparent transition placeholder:text-gray-500 focus:bg-white focus:ring-orange-400"
      />

      {open && results.length > 0 && (
        <ul className="absolute z-[1000] mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => {
                onSelect({
                  name: place.display_name,
                  lat: Number(place.lat),
                  lng: Number(place.lon),
                });
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationInput;