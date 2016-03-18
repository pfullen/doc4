(function() {
  // 'use strict';
  var React = require('react'),
  ReactDOM = require('react-dom'),
  localStorage = require('localStorage'),
  DocumentStore = require('../../stores/DocumentStore'),
  DocumentAction = require('../../actions/DocumentActions'),
  toastr = require('toastr'),
  browserHistory = require('react-router').browserHistory;

  var Update = new React.createClass({
    getInitialState: function() {
      return {
        document: [],
        title: '',
        content: '',
        updatedDoc: {
          title: '',
          content: '',
          access: ''
        }
      };
    },

    componentWillMount: function() {
      var pathArray = localStorage.getItem('document');
      var token = localStorage.getItem('x-access-token');
      DocumentAction.setDoc(pathArray, token);
    },

    componentDidMount: function() {
      DocumentStore.addChangeListener(this.handleSelected, 'doc');
    },

    handleSelected: function() {
      var selectDoc = DocumentStore.getSelectedDoc();
      console.log('selected kwa updates', selectDoc[0]);
      var doc = [].concat(selectDoc);
      this.setState({
        document: doc,
        title: doc[0].title,
        content: selectDoc[0].content
      });
    },

    fetchInputValues: function(event) {
      var field = event.target.name;
      var value = event.target.value;
      console.log(value);
      this.state.updatedDoc[field] = value;
      this.setState({updatedDoc: this.state.updatedDoc});
    },

    update: function() {
      var newDoc = this.state.updatedDoc;
      if (this.state.updatedDoc.title.length < 1 && this.state.updatedDoc.content.length < 1 && this.state.updatedDoc.access.length < 1) {
        toastr.warning('Please fill out content to be updated');
      }
      var token = localStorage.getItem('x-access-token');
      var docId = localStorage.getItem('document');
      DocumentAction.updateDoc(docId, newDoc, token);
      toastr.success('Document has been Updated', {timeout: 3000});
      browserHistory.push('/dashboard');
      // window.location.assign('/dashboard');
    },

    render: function() {
      var content = 'Paste content and Edit here';
      return (
        <div className="mdl-grid">
          <div id="update-doc" className="mdl-cell mdl-cell--8-col mdl-cell--2-offset-desktop mdl-cell--12-col-tablet">
            <div className="demo-card-square mdl-card mdl-shadow--2dp">
              <div className="mdl-card__supporting-text mdl-cell mdl-cell--12-col">
                <form id ="form-document">
                  <div className="mdl-textfield mdl-js-textfield  mdl-cell--11-col">
                    <label className="mdl-textfield__label" htmlFor="title" >{this.state.title}</label>
                    <input className="mdl-textfield__input" type="text" id="title" name="title" onChange={this.fetchInputValues} />
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-cell--11-col">
                    <label className="mdl-textfield__label" htmlFor="text" >{content}</label>
                    <textarea className="mdl-textfield__input" type="text" rows= "6" cols="60" id="text" name="content" onInput={this.fetchInputValues} ></textarea>
                  </div>
                  <div className="mdl-grid">
                    <div className="mdl-cell--12-col radio">
                      <input type="radio" name="access" value="Admin" defaultChecked onChange={this.fetchInputValues}>&nbsp; Admin</input>
                    </div>
                    <div className="mdl-cell--12-col radio">
                      <input type="radio" name="access" value="Staff" onChange={this.fetchInputValues}>&nbsp; Staff</input>
                    </div>
                    <div className="mdl-cell--12-col radio">
                      <input type="radio" name="access" value="Viewer" onChange={this.fetchInputValues}>&nbsp; Viewer</input>
                    </div>
                  </div>
                  </form>
                  <div className="mdl-dialog__actions mdl-cell mdl-cell--11-col">
                    <button id="updatedoc" type="button" className="mdl-button" onClick={this.update}>UPDATE</button>
                    <a href={'/dashboard'} type="button" className="mdl-button close">CANCEL</a>
                  </div>
                </div>
              </div>
          </div>
      </div>
      );
    }
  });

  module.exports = Update;
})();
