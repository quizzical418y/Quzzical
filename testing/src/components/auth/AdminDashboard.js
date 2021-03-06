import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'

const userInfo = {
    name: "",
    email: "",
    accountType: "Administrator",
}

class Dashboard extends React.Component {
  constructor(props){
    super()
    this.state = {
      testList : [],
      isAdmin : true,
      userName: '',
      userEmail: '',
      userType: 'Administrator',
      questionList : []
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.deleteTest = this.deleteTest.bind(this)
    this.deleteQuestion = this.deleteQuestion.bind(this)

  }
  makeObj(input, x){
    if(x.ANSWER_FIVE_TEXT == null){
      input = {
        q: x.QUESTION_TEXT,
        an1: x.ANSWER_ONE_TEXT,
        an2: x.ANSWER_TWO_TEXT,
        an3: x.ANSWER_THREE_TEXT,
        an4: x.ANSWER_FOUR_TEXT,
        qID: x.QUESTION_ID,
        isMult: x.IS_MULTIPLE,
        correct: x.CORRECT
      }
      return input
    }else if(x.ANSWER_SIX_TEXT == null){
       input = {
        q: x.QUESTION_TEXT,
        an1: x.ANSWER_ONE_TEXT,
        an2: x.ANSWER_TWO_TEXT,
        an3: x.ANSWER_THREE_TEXT,
        an4: x.ANSWER_FOUR_TEXT,
        an5: x.ANSWER_FIVE_TEXT,
        qID: x.QUESTION_ID,
        isMult: x.IS_MULTIPLE,
        correct: x.CORRECT
      }
      return input
    }else{
      input = {
        q: x.QUESTION_TEXT,
        an1: x.ANSWER_ONE_TEXT,
        an2: x.ANSWER_TWO_TEXT,
        an3: x.ANSWER_THREE_TEXT,
        an4: x.ANSWER_FOUR_TEXT,
        an5: x.ANSWER_FIVE_TEXT,
        an6: x.ANSWER_SIX_TEXT,
        qID: x.QUESTION_ID,
        isMult: x.IS_MULTIPLE,
        correct: x.CORRECT
      }
      return input
    }
  }
  componentDidMount(){
    axios.post('/api/users/current', userInfo)
      .then(res => {
        // console.log(res.data.email)
        if(res.data.bad == 'bad'){
          window.location = '/'
        }
        this.setState({
          userEmail: res.data.email,
          userName: res.data.name
        })
      })
    
    axios.post('/api/admin/getQuestion', {})
      .then(res => {
        console.log(res.data)
        var array = []
        res.data.ques.forEach(x => {
          if(x.IS_MULTIPLE == 0){
            const quest = {
              q: x.QUESTION_TEXT,
              an1: x.ANSWER_ONE_TEXT,
              an2: x.ANSWER_TWO_TEXT,
              qID: x.QUESTION_ID,
              correct: x.CORRECT,
              isMult: x.IS_MULTIPLE
            }
            // console.log('this is the quest id' + quest.qID);
            array.push(quest)
            // console.log(array);
            
          }else{
            var input = {}
            input = this.makeObj(input, x)

            // console.log(input);
            array.push(input)
          }
        })
        this.setState({
          questionList: array 
        })
        console.log(this.state.questionList)
      })

    axios.post('/api/admin/getTest', {})
      .then(res => {
        // console.log(res);
        
        var array = []
        res.data.test.forEach(x => {
          // console.log(x.TEST_ID);
          
          const test = {
            tID: x.TEST_ID,
            tn: x.NAME,
            td: x.TEST_DESCRIPTION,
            tl: x.TIME_LIMIT
          }
          array.push(test)
        })
        this.setState({
          testList: array
        })
      })
      
  }
  onChange(e){
    this.setState({[e.target.name]: e.target.value})
  }
  onSubmit(e){
    e.preventDefault()
  }
  deleteTest(test){
    // REMOVE TEST FROM DATABASE
    const tempList = this.state.testList
    console.log('test: ' + test.tID);
    axios.post('/api/admin/deleteTest', {test: test}) 
      .then(res => {
        tempList.splice(tempList.indexOf(test), 1)
        this.setState({testList : tempList})
      })
    
  }
  deleteQuestion(question){
    // REMOVE TEST FROM DATABASE
    const tempList = this.state.questionList
    axios.post('/api/admin/deleteQuestion', {question: question}) 
      .then(res => {
        tempList.splice(tempList.indexOf(question), 1)
        this.setState({questionList : tempList})
      })
  }
  createAdminTestTable = () => {
    let list = []
    list.push(
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Test Name</th>
          <th scope="col">Description</th>
          <th scope="col">View Test</th>
          <th scope="col">Assign Users</th>
          <th scope="col">Delete? </th>
        </tr>
      </thead>
    )
    for (let i = 0; i < this.state.testList.length; i++) {
      let children = []
      children.push(<td className="align-middle">{i+1}</td>)
      children.push(<td className="align-middle">{this.state.testList[i].tn}</td>)
      children.push(<td className="align-middle">{this.state.testList[i].td}</td>)
      children.push(<td><Link className="btn btn-success btn-space" to={{
        pathname: "/AdminViewTest",
        state: { testId : this.state.testList[i].tID,
          testName : this.state.testList[i].tn,
          timeLimit: this.state.testList[i].tl}
      }}>View</Link></td>)
      children.push(<td><Link className="btn btn-warning btn-space" to={{ 
        pathname : "/assgintest",
        state : { test : this.state.testList[i] }
      }}>Assign Test</Link></td>)
      children.push(<td><Link className="btn btn-danger btn-space" to="/admindashboard"
      onClick={this.deleteTest.bind(this, this.state.testList[i])}>Delete</Link></td>)
      //Create the parent and add the children
      list.push(<tr>{children}</tr>)
    }
    return list
  }

  createQuestionBankTable = () => {
    let list = []
    list.push(
      <thead>
        <tr>
          <th scope="col" className="align-middle">#</th>
          <th scope="col" className="align-middle">Question </th>
          <th scope="col" className="align-middle">Answer #1</th>
          <th scope="col" className="align-middle">Answer #2</th>
          <th scope="col" className="align-middle">Answer #3</th>
          <th scope="col" className="align-middle">Answer #4</th>
          <th scope="col" className="align-middle">Answer #5</th>
          <th scope="col" className="align-middle">Answer #6</th>
          <th scope="col" className="align-middle">View</th>
          <th scope="col" className="align-middle">Delete? </th>
        </tr>
      </thead>
    )
    for (let i = 0; i < this.state.questionList.length; i++) {
      let children = []
      children.push(<td className="align-middle">{i+1}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].q}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].an1}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].an2}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].an3}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].an4}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].an5}</td>)
      children.push(<td className="align-middle">{this.state.questionList[i].an6}</td>)
      // console.log("Question Text:", this.state.questionList[i].q);
      
      children.push(<td><Link className="btn btn-success btn-space" to={{
        pathname: "/questionView",
        state: { question: this.state.questionList[i] }
      }}>View</Link></td>)
      children.push(<td><Link className="btn btn-danger btn-space" to="/admindashboard"
      onClick={this.deleteQuestion.bind(this, this.state.questionList[i])}>Delete</Link></td>)
      //Create the parent and add the children
      list.push(<tr>{children}</tr>)
    }
    return list
  }
  render() {
          return(
            <div className="dashboard">
              <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">ADMIN DASHBOARD</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <table className="table">
                    <tr>
                      <th scope="col">Name:</th>
                      <th scope="col">Email:</th>
                      <th scope="col">Create Account</th>
                      <th scope="col">Create Test</th>
                      <th scope="col">Create Question</th>
                      <th scope="col">Upload Test</th>
                    </tr>
                    <tr>
                      <td className="align-middle">{this.state.userName}</td>
                      <td className="align-middle">{this.state.userEmail}</td>
                      <td className="align-middle">
                        <Link className="btn btn-success btn-space" to="/register">Create Account</Link>
                      </td>
                      <td className="align-middle">
                        <Link className="btn btn-warning btn-space" to="/createtest">Create Test</Link>
                      </td>
                      <td className="align-middle">
                        <Link className="btn btn-warning btn-space" to="/createquestion">Create Question</Link>
                      </td>
                      <td className="align-middle">
                        <Link className="btn btn-success btn-space" to="/upload">Upload Test</Link>
                      </td>
                    </tr>
                  </table>
                </div>
                </div>
                <div className="row">
                <div className="col-md-12">
                  <h1 className="display-12 text-center">Tests:</h1>
                    <table className="table table-striped">
                        {this.createAdminTestTable()}
                    </table>
                    <h1 className="display-12 text-center">Question Bank:</h1>
                    <table className="table table-striped">
                      {this.createQuestionBankTable()}
                    </table>
                    
                </div>
               
              </div>
          </div>
          )
      }
}

export default Dashboard
