import { useRef } from "react";
import './Search.css'

function Search({ doSearch }) {

    const searchBox = useRef(null);

    const search = (e) => {
        const text = searchBox.current.value.trim();

        const ignoredKeys = [
            'Shift', 'Control', 'Alt', 'Meta',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'CapsLock', 'Tab'
        ];

        if (ignoredKeys.includes(e.key)) return;

        doSearch(text);
    };

    return (
        <div className="position-relative search-form d-none d-sm-block">
            <i className="bi bi-search search-icon-inside"></i>
            <input
                ref={searchBox}
                onKeyUp={search}
                type="text"
                className="form-control search-input-with-icon"
                placeholder="Search"
            />
        </div>
    );


}

export default Search;