export function validate(word) {
  if(word === "" || word === undefined || word === null || word.replace(/\s/g, '') === "") {
    return false;
  }

  return true;
}

export function filterItems(items, validateFn) {
  return items.map((item, i) => {
    if (validateFn(item)) {
      return <div className="nw-exa" key={i}>{`${++i}. ${item}`}</div>;
    } else {
      return <div className="nw-exa" key={i}>{`${++i}. Didn't set`}</div>
    }
  });
}
