import { useEffect } from "react";
import { Input, initMDB, Modal } from 'mdb-ui-kit';
import axios from 'axios';

const Search = () => {
  useEffect(() => {
    initMDB({ Input });

    document.getElementById("searchbox")?.addEventListener("keyup", (e: Event) => {
      // @ts-ignore
      if (e.key === "Enter") {
        const searchValue = (e.target as HTMLInputElement).value;

      }
    });
  }, []);
  
  return (
    <div>
      <div className="form-outline" data-mdb-input-init>
        <input type="text" id="searchbox" className="form-control" />
        <label className="form-label" htmlFor="searchbox">Find new music</label>
      </div>
    </div>
  );
}
 
export default Search;