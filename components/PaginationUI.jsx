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
