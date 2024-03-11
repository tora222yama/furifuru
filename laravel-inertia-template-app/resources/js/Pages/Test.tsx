import * as React from 'react';

interface IPros {}
export const Test: React.FC<IPros> = () => {
  return (
    <React.Fragment>
    <div>
        this is default pages.
    </div>
    <div>
        first-record
    </div>
    <div>
        second-record
    </div>
    </React.Fragment>
  )
}
export default Test;
