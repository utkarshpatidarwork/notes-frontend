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
              ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 dark:text-white"
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