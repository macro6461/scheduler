import React from "react";

import "antd/dist/antd.css";

import { Card, Radio, Table, Input, Icon, Tooltip, Button, Select, Popconfirm, message } from "antd";

const Option = Select.Option;

const RadioGroup = Radio.Group;

const RadioButton = Radio.Button;



class Schedule extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            allDates: [],

            weekdays: [],

            weekends: [],

            selected: null,

            daySearch: [],

            dayType: '0',

            num: '',

            daysOfTheWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        };

    }



    onDayTypeChange = (e) => {

        this.setState({

            dayType: e.target.value

        });

    }

    dayOfWeekChange = (e) => {

        this.setState({

            daySearch: e

        })
    }

    clearSearch = () => {
        this.setState({

            daySearch: []

        })
    }

    onDelete = (x) => {
        this.setState({
            selected: x
        }, () => {
            this.removeTask(this.state.selected.id)
        })
    }

    removeTask = (id) => {
        let arr = this.state.allDates.filter((x) => {
            return x.id !== id
        })
        let weekdays = arr.filter((x) => {
            return x.day > 0 && x.day < 5
        })
        let weekends = arr.filter((x) => {
            return x.day > 5 || x.day === 0
        })
        this.setState({
            allDates: arr,
            weekdays,
            weekends
        })
    }

    onEdit = (x) => {
        this.setState({
            selected: x
        }, () => {
            console.log(this.state.selected)
        })
    }

    changeTodo = (x) => {
        this.setState({
            selected: x
        }, () => {
            this.findTodo(this.state.selected.id)
        })
    }

    findTodo = (id) => {
        let arr = this.state.allDates.map((x) => {
            if (x.id === id) {
                x.completed = !x.completed
                return x
            } else {
                return x
            }
        })
        
        let weekdays = arr.filter((x) => {
            return x.day > 0 && x.day < 5
        })

        let weekends = arr.filter((x) => {
            return x.day > 5 || x.day === 0
        })
        
        this.setState({
            allDates: arr,
            weekdays,
            weekends
        })
    }

    getAllDates = (x) => {
        let num = parseInt(x)
        let allDates = [];
        let weekdays = [];
        let weekends = [];
        for (var i = 0; i < num; i++) {
            let thisTask = {}
            let tempDate = new Date(new Date().getTime() + (i * 24 * 60 * 60 * 1000));
            thisTask['completed'] = false;
            thisTask['id'] = i
            thisTask['day'] = tempDate.getDay();
            thisTask['dayOfWeek'] = this.state.daysOfTheWeek[tempDate.getDay()];
            thisTask['date'] = this.formatDate(tempDate)
            allDates.push(thisTask)
            thisTask.day > 5 || thisTask.day === 0 ? weekends.push(thisTask) : weekdays.push(thisTask);
        }
        this.setState({
            allDates,
            weekends,
            weekdays
        })
    };



    formatDate = (x) => {

        let dd = String(x.getDate())

        let mm = String(x.getMonth() + 1) //January is 0!

        let yyyy = x.getFullYear();

        let date = mm + '/' + dd + '/' + yyyy;

        return date

    };



    changeNum = (e) => {

        this.setState({

            num: e.target.value

        }, () => {

            if (this.state.num !== '' || this.state.num !== 0) {

                this.getAllDates(this.state.num)

            }

        })

    }



    render() {



        let datasource;

        let filteredDatasource;

        if (this.state.dayType === '0') {

            datasource = this.state.allDates

        } else if (this.state.dayType === '1') {

            datasource = this.state.weekdays

        } else {

            datasource = this.state.weekends

        }

        if (this.state.daySearch.length > 0) {
            filteredDatasource = datasource.filter((x) => {
                return this.state.daySearch.includes(x.dayOfWeek)
            })
        }



        const columns = [

            {

                title: "Date",

                dataIndex: "date",

                key: "date",

                render: (text) => {

                    return <a href="javascript:">{text}</a>

                }

            }, {

                title: "Day of Week",

                dataIndex: "dayOfWeek",

                key: "dayOfWeek",

                render: text => <a href="javascript:">{text}</a>

            }, {

                title: "Task",

                dataIndex: "task",

                key: "task",

                // render: text => <a href="javascript:">{text}</a>

            },

            {

                title: "Description",

                dataIndex: "description",

                key: "description",

                // width: "20%",

                // render: text => <p>{text}</p>

            },

            {

                title: "Created At",

                dataIndex: "createdAt",

                key: "createdAt"

            },

            {

                title: "Updated At",

                dataIndex: "updatedAt",

                key: "updatedAt"

            },

            {

                title: "Action",

                key: "action",

                render: record => (
                    <div>
                        <Popconfirm title="Are you sure you want to delete this task?" 
                        onConfirm={() => { this.onDelete(record) }} okText="Yes" cancelText="No"
                        >
                            < Button type="danger" 
                            shape="circle" 
                            icon="delete" 
                            size='small' 
                            style={{ marginRight: 5 }} />
                        </Popconfirm>
                        < Button type="primary" shape="circle" 
                        icon="edit" 
                        size='small' 
                        style={{ marginRight: 5 }} onClick={() => { this.onEdit(record) }} 
                        />
                    </div >
                )

            },

            {

                title: "Completed",

                key: "completed",

                render: record => record.completed 
                ? <Popconfirm title="Mark Incomplete?" onConfirm={()=>{this.changeTodo(record)} } okText="Yes" cancelText="No">
                    <Icon type="check-circle" style={{ color: '#52c41a' }}/>
                  </Popconfirm> 
                : <Popconfirm title="Mark Complete?" onConfirm={()=>{this.changeTodo(record)}} okText="Yes" cancelText="No">
                    <Icon type="check-circle" style={{ color: '#D3D3D3' }} />
                  </Popconfirm>

            }

        ];



        return (

            <div>

                <Card>

                    <Input onChange={this.changeNum.bind(this)}

                        value={this.state.num}

                        style={{ width: 200 }}

                        prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}

                        suffix={

                            <Tooltip title="Number of days includes today and days after.">

                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />

                            </Tooltip>

                        }

                        placeholder="Enter Number of Days" />

                    <br /><br />

                    <RadioGroup

                        onChange={this.onDayTypeChange.bind(this)}

                        value={this.state.dayType}

                    >

                        <RadioButton value="0">{this.state.allDates.length > 0 ? 'All' + ` (${this.state.allDates.length})` : 'All'} </RadioButton>

                        <RadioButton value="1">{this.state.weekdays.length > 0 ? 'Weekdays' + ` (${this.state.weekdays.length})` : 'Weekdays'} </RadioButton>

                        <RadioButton value="2">{this.state.weekends.length > 0 ? 'Weekends' + ` (${this.state.weekends.length})` : 'Weekends'}</RadioButton>

                    </RadioGroup>

                    <br /><br />

                    <div style={{ position: 'relative', width: 405, display: 'inline-block' }}>

                        <Icon type="search" style={{ position: 'absolute', zIndex: 100, fontSize: 20, top: 6, right: 5 }} />
                        <Select
                            mode="multiple"
                            style={{ width: '405px', marginLeft: 5 }}
                            value={this.state.daySearch}
                            placeholder="Please select days of the week"
                            onChange={this.dayOfWeekChange.bind(this)}
                        >
                            {this.state.daysOfTheWeek.map((x) => {
                                return <Option key={x}>{x}</Option>;
                            })}
                        </Select>
                    </div>
                    {this.state.daySearch.length > 0
                        ? <Button style={{ display: 'inline-block', marginLeft: 10 }} onClick={this.clearSearch}>Clear Search</Button>
                        : null
                    }

                    <br />
                    <br />

                    <Table columns={columns}

                        dataSource={this.state.daySearch.length > 0 ? filteredDatasource : datasource}

                        size="small"

                        pagination={false}

                        title={() => { return <h3><Icon type='schedule' /> Your Schedule </h3> }}

                        rowKey={record => record.id}

                    />

                </Card>
            </div>

        );

    };

}



export default Schedule;