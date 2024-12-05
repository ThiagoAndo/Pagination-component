# Reusable Pagination Component

In my ongoing journey as a developer, I’ve recently tackled an essential feature for my e-commerce project: **pagination**. To enhance the user experience, I implemented a seamless way to navigate through products on the home page and created a reusable **Pagination Component** in the process.

What’s exciting is that I’ve made this component available for others to learn from! Here’s what it offers:

- **Clean State Management:** Leveraging React’s `useReducer` hook, I managed loading, data, and error states efficiently in a single function.  
- **Reusable Custom Hook:** Following the **DRY (Don’t Repeat Yourself)** principle, I designed a custom hook for API data fetching, which can be applied across different parts of the application.  
- **Core Pagination Logic:** The component includes the fundamental logic for pagination, providing a practical example of how to implement this feature in your own projects.  

I’m sharing this component because I believe learning from real-world examples is one of the best ways to grow as a developer. Whether you’re curious about how pagination works or looking to enhance your React projects, I hope this can serve as a valuable resource.

If you’d like to explore the component or discuss best practices for pagination, feel free to connect or drop a comment! Let’s keep learning and growing together. 🚀
## Screenshot

<br />
<br />

<p align="center" style="solid 1px red">
    <img  src="assets/screenshots/Screenshot 2024-12-05 103651.png" alt="Mobile Version Picture">
     <figcaption>Fig.1 - Home page</figcaption>
</p>
<br />
<br />

## Component

```js
import { useState, useReducer, useEffect } from "react";
import styles from "./PaginationUI.module.css"

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "OK":
      return { ...state, isLoading: false, data: action.data, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
};

const useFetch = (url, headers = {}) => {
  const fetchData = async () => {
    try {
      const response = await fetch(url, headers);
      if (!response.ok) {
        throw new Error(
          "Could not fetch data from server. Please try again later."
        );
      }
      const resData = await response.json();
      return { error: null, data: resData };
    } catch (err) {
      return { error: err.message, data: [] };
    }
  };

  return { fetchData };
};

const PaginationUI = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pagination, setPagination] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(state.data.length / itemsPerPage);

  const { fetchData } = useFetch(
    "https://jsonplaceholder.typicode.com/posts",
    null
  );

  useEffect(() => {
    const handleFetch = async () => {
      dispatch({ type: "LOADING" });
      const { error, data } = await fetchData();

      if (error) {
        dispatch({ type: "ERROR", error });
      } else {
        dispatch({ type: "OK", data });
      }
    };

    handleFetch();
  }, []);

  const currentPageItems = state.data.slice(
    (pagination - 1) * itemsPerPage,
    pagination * itemsPerPage
  );

  const handlePrevious = () => pagination > 1 && setPagination(pagination - 1);
  const handleNext = () =>
    pagination < totalPages && setPagination(pagination + 1);
  const handlePageClick = (num) => setPagination(num);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Paginated List</h1>

      {state.isLoading && <p className={styles.loading}>Loading...</p>}
      {state.error && <p className={styles.error}>{state.error}</p>}

      {!state.isLoading && !state.error && (
        <>
          <ul className={styles.list}>
            {currentPageItems.map((item) => (
              <li key={item.id} className={styles.listItem}>
                <h2>{item.title}</h2>
                {item.body}
              </li>
            ))}
          </ul>

          <div className={styles.pagination}>
            <button
              className={`${styles.button} ${
                pagination === 1 && styles.disabled
              }`}
              disabled={pagination === 1}
              onClick={handlePrevious}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`${styles.button} ${
                  pagination === index + 1 && styles.active
                }`}
                onClick={() => handlePageClick(index + 1)}
                aria-label={`Go to page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className={`${styles.button} ${
                pagination === totalPages && styles.disabled
              }`}
              disabled={pagination === totalPages}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginationUI;

```



### Instructions

- Fork this repository
- Clone your forked repository
- CD into the project folder



To install the application:

```shell
npm install
```

To start the development server:

```shell
npm run dev
```


## Author

- Github - [Thiago Ando de Freitas](https://github.com/ThiagoAndo)
- Personal website - [Portfolio](https://thiago-freitas-portfolio.vercel.app/)
- Live Website - [Connected World Explore](https://rest-mult-api.netlify.app)

<hr />

 <div style="text-align: center" >
<h5 style="color:black;">"The impediment to action advances action. What stands in the way becomes the way"</h5>
<h5 style="color:black;">Marcus Aurelius </h5>
</div>

