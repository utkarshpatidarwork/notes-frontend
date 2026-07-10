//CategoryFilters.jsx
function CategoryFilters({
  selectedCategory,
  setSelectedCategory
}) {

  return (

    <div
      className="
        flex
        flex-wrap
        gap-3
        mb-8
      "
    >

      {
        [
          "All",
          "General",
          "Work",
          "Personal",
          "Study",
          "Ideas",
          "Projects"
        ].map((cat) => (

          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(cat)
            }
            className={`
              px-4
              py-2
              rounded-full
              transition
              cursor-pointer
              ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-slate-200 dark:bg-slate-800 dark:text-white hover:dark:bg-slate-700"
              }
            `}
          >
            {cat}
          </button>

        ))
      }

    </div>
  );
}

export default CategoryFilters;