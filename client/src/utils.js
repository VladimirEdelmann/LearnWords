function validate(word) {
    if(word === "" || word === undefined || word === null || word.replace(/\s/g, '') === "") {
      return false;
    }

    return true;
}

export default validate;
