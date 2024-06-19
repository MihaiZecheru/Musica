import { useEffect } from "react";
import { Input, initMDB, Modal } from 'mdb-ui-kit';

const Search = () => {
  useEffect(() => {
    initMDB({ Input });
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