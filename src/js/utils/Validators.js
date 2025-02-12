define(['ojs/ojasyncvalidator-regexp'], function (AsyncRegExpValidator) {

  const self = this;
  self.requiredText = (hint) => new AsyncRegExpValidator({
    pattern: "[a-zA-Z0-9 ,.'-]{1,}",
    hint: hint,
    messageDetail: `{label} is required`
  });

  self.number = (min = 1, max = 10) => new AsyncRegExpValidator({
    pattern: `[0-9]{${min},${max}}`,
    hint: (min == max) ? `${min} digit number` : `Minimum ${min}, Maximum ${max} digits`,
    messageDetail: `Please enter valid input`
  });


  self.required = (min = 1, max = ``) => new AsyncRegExpValidator({
    pattern: `^.{${min},${max}}$`,
    hint: (min == max) ? `${min} characters` : `Minimum ${min} ` + ((max) ? `,Maximum ${max}` : '') + `characters`,
    messageDetail: `Please enter valid input`
  });

  self.email = new AsyncRegExpValidator({
    pattern: ".+\@.+\..+",
    hint: "Email Address",
    messageDetail: "Invalid email format"
  });

  self.password = new AsyncRegExpValidator({
    pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}',
    label: "Password",
    messageSummary: "{label} too Weak",
    messageDetail: "You must enter a password that meets our minimum security requirements."
  });

  this.equalToPassword = {

    validate: function (value) {
      var compareTo = this.password.peek();
      if (!value && !compareTo)
        return;
      else if (value !== compareTo) {
        throw new Error(bundle['app']['validator-equalTo']['summary']);
      }
      return;
    }.bind(this)
  };

  return {
    required: self.required,
    number: self.number,
    email: self.email,
    confirmPassword: this.equalToPassword,
    length: self.length,
    requiredText: self.requiredText
  }

})