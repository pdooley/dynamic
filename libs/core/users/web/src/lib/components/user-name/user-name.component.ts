import { Component, Input } from '@angular/core';

import { User } from '@vsolv/core/users/domain';

@Component({
  selector: 'vsolv-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss'],
})
export class UserNameComponent {
  @Input() user?: User;
}
