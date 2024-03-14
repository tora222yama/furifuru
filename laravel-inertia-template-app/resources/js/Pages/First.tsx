import * as React from 'react';

interface IPros {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
}
export const First: React.FC<IPros> = ({ numberValue, stringValue, arrayValue }) => {

  const handleClick = () => {
    console.log('クリックされた')
  }

  return (
    <React.Fragment>
      <div>
        This is First Page.
      </div>
      <div>
        number: { numberValue }
      </div>
      <div>
        string: { stringValue }
      </div>
      {arrayValue.map(v => {
        return (
          <div key={v}>
            {v}
          </div>
        )
      })}
      <div
        style={{background: '#F00' }}
        onClick={() => handleClick()}
      >
        test
      </div>
    </React.Fragment>
  )
}
export default First;
