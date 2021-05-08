import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { HttpService } from '../../shared-service/http.service';


export interface IUser {
  id?: number;
  email: string;
  password: string;
  userame: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private http: HttpService
  ) { }

  async ngOnInit() {
    await this.refresh();
    // this.createUser('user', { make: 'Tesla', model: 'X'});
    // this.updateUser('user/id/1', { make: 'Ford', model: 'Fiasta'});
  }

  async refresh() {
    this.users = await this.getUsers('user');
  }

  // getUsers('user');
  async getUsers(path: string) {
    const resp = await this.http.get(path);
    console.log('resp from getUsers()', resp);
    return resp;
  }

  async createUser() {
    const user = {
      username: null,
      email: null
    };
    const resp = await this.http.post('user', user);
    console.log('from createUser resp: ', resp);
    if (resp) {
      // this.refresh();
      this.users.unshift(resp);
    } else {
      this.toastService.showToast('danger', 3000, 'User create failed!');
    }
    return resp;
  }

  async updateUser(user: any) {
    console.log('from updateUser user: ', user);
    const resp = await this.http.put(`user/id/${user.id}`, user);
    if (resp) {
      this.toastService.showToast('success', 3000, 'User updated successfully!');
    }
    return resp;
  }

  async removeUser(user: any, index: number) {
    console.log('from removeUser...', index);
    // this.users.splice(index, 1);
    const resp = await this.http.delete(`user/id/${user.id}`);
    console.log('resp from removeUser...', resp);
    if (resp) {
      this.refresh();
    } else {
      this.toastService.showToast('danger', 3000, 'Delete user failed!');

    }
  }

  async logout() {
    const resp = await this.http.logout();
    if (resp.statusCode === 200) {
      localStorage.removeItem('id_token');
      this.router.navigate(['login']);
    }
  }


}
