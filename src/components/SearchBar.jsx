//SearchBar.jsx
function SearchBar({
  search,
  setSearch
}) {

  return (

    <div className="mb-6">

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          bg-white
          dark:bg-slate-800
          dark:text-white
          border
          rounded-xl
          px-4
          py-3
          outline-none
          focus:ring-2
          focus:ring-blue-500
          shadow-sm
        "
      />

    </div>
  );
}

export default SearchBar;