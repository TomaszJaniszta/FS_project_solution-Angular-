import { Component, VERSION } from '@angular/core';
import { Order } from './order.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  constructor(private _http: HttpClient) {};

  public  angularVersion: string = 'Angular ' + VERSION.major;

  public searchPhrase: any | null = '';
  public searchPhrasesFilter: string = '';
  public filteredOrders: Array<Order> = [];
  public ordersData: Array<any> = [];
  public headers: Array<string> = [ 'Index','WO ID','Description','Received date','Assigned to','Status','Priority' ];

  public selectedOption: string = 'All';
  public priority: Array<string>= ['All', 'Low', 'Normal', 'High'];

  public filterPriority($event: Event){
    this.selectedOption = (($event.target as HTMLOptionElement).value);
    this._transform();
  }

  public ordersFilter(searchPhrase: string) {
    if (!searchPhrase) {
      alert('No data provided in filter :(');
    } else {
      this.searchPhrasesFilter = searchPhrase;
      this._transform();
    };
    this.searchPhrase = '';
  };

  public ordersClearFilter() {
    this.searchPhrasesFilter = '';
    this._transform();
  };

  // dataAll = {
  //   exec_time: 0.11,
  //   response: {
  //     current_page: 1,
  //     from: 1,
  //     last_page: 1,
  //     per_page: 10,
  //     to: 10,
  //     total: 8,
  //     data: [
  //       {
  //         work_order_id: 1,
  //         description: 'Create a connection to SQL database using Excel',
  //         received_date: '2021-07-21 00:23:03',
  //         assigned_to: [
  //           {
  //             person_name: 'Technician One',
  //             status: 'Assigned',
  //           },
  //         ],
  //         status: 'New',
  //         priority: 'Low',
  //       },

  //       {
  //         work_order_id: 2,
  //         description: 'Need to make update for laptop 11',
  //         received_date: '2021-07-20 15:23:03',
  //         assigned_to: [
  //           {
  //             person_name: 'Technician Two',
  //             status: 'Assigned',
  //           },
  //         ],
  //         status: 'New',
  //         priority: 'Low',
  //       },

  //       {
  //         work_order_id: 3,
  //         description: 'Setup station 2',
  //         received_date: '2021-07-20 14:23:03',
  //         assigned_to: [
  //           {
  //             person_name: 'Technician One',
  //             status: 'In progress',
  //           },
  //         ],
  //         status: 'Confirmed',
  //         priority: 'High',
  //       },

  //       {
  //         work_order_id: 4,
  //         description: 'Setup station 3',
  //         received_date: '2021-07-19 12:23:03',
  //         assigned_to: [
  //           {
  //             person_name: 'Technician Two',
  //             status: 'Assigned',
  //           },
  //           {
  //             person_name: 'Technician One',
  //             status: 'In progress',
  //           },
  //         ],
  //         status: 'Confirmed',
  //         priority: 'High',
  //       },

  //       {
  //         work_order_id: 5,
  //         description: 'Mailbox issues',
  //         received_date: '2021-07-19 11:23:03',
  //         assigned_to: [
  //           {
  //             person_name: 'Technician Two',
  //             status: 'Confirmed',
  //           },
  //         ],
  //         status: 'Confirmed',
  //         priority: 'Normal',
  //       },

  //       {
  //         work_order_id: 6,
  //         description: 'Subject: We sent you issue last Friday',
  //         received_date: '2021-07-17 11:23:03',
  //         assigned_to: [],
  //         status: 'New',
  //         priority: 'Low',
  //       },

  //       {
  //         work_order_id: 7,
  //         description: 'Internal work',
  //         received_date: '2021-07-17 10:23:03',
  //         assigned_to: [],
  //         status: 'Canceled',
  //         priority: 'Low',
  //       },

  //       {
  //         work_order_id: 8,
  //         description: 'Set up station for new user',
  //         received_date: '2021-07-16 09:23:03',
  //         assigned_to: [
  //           {
  //             person_name: 'Technician Two',
  //             status: 'Completed',
  //           },
  //         ],
  //         status: 'Completed',
  //         priority: 'Low',
  //       },
  //     ],
  //   },
  // };

  public loadOrdersData() {
      const URL = 'http://localhost:8080/orders';
      this._http.get(URL, {headers: {"accept": 'application/json'},
      }).subscribe((response: any) => {
      this.ordersData = response.response.data;
  });
    this._transform();
   };

  public reset = () => {
    this.filteredOrders = [];
    this.searchPhrasesFilter = '';
  };

  private _transform = () => {
    this.filteredOrders = [];
    let tempOrders = this.ordersData;

      if(this.selectedOption !== 'All'){
        tempOrders = tempOrders.filter((order) =>
        order.priority.toLowerCase() === this.selectedOption.toLowerCase());
      };

      if(this.searchPhrasesFilter){
        tempOrders = tempOrders.filter((order) =>
          // ? to avoid null error for type script
          order.description.toLowerCase().includes(this.searchPhrasesFilter?.toLowerCase()));
      };

    tempOrders.forEach((e: any) => {
      let assignedArray: any = [];
      let assigned = () => {
        if (e.assigned_to.length < 1) {
          return 'No data';
        } else {
          e.assigned_to.forEach((e: any) => {
            let person_name = !e.person_name ? 'Not assigned' : e.person_name;
            let status = !e.status ? 'Unknown' : e.status;
            assignedArray.push(JSON.stringify(person_name + ', status: ' + status));
          });
        }
        return JSON.stringify(assignedArray).replace(']', '').replace('[', '');
      };

      let orderElements = {
        'Index': 0,
        'WO ID': e.work_order_id,
        'Description': e.description,
        'Received date': e.received_date,
        'Status': e.status,
        'Priority': e.priority,
        'Assigned to': assigned(),
      };
      this.filteredOrders.push(orderElements);
      this.filteredOrders[this.filteredOrders.length - 1].Index = this.filteredOrders.length;
    });
  };
}