import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import EqComponent from '@shared/layout/EqComponent';
import { ContentSelectionService } from '../content-selection.service';
import CreatorTable from '../central-area/CreatorTable';

@Component({
  selector: 'app-table-add',
  templateUrl: './table-add.component.html',
  styleUrls: ['./table-add.component.css']
})
export class TableAddComponent implements OnInit {

  constructor(private modal: ModalService,
              private selection: ContentSelectionService) { }

  ngOnInit() {
  }

  /**
   * Add a new row to the table.
   */
  row() {
    // Get the table
    const table = this.selection.canvasInstance.getSelectedLayout().component as CreatorTable;
    // Get the children of the table
    const children: EqComponent<any>[][] = table.getChildren();
    // Add another row filled with null and same amount of columns
    children.push(new Array(children[0].length).fill(null));
    // Save the change
    this.selection.canvasInstance.save();
    // Close
    this.modal.remove();
  }

  /**
   * Add a new column to the table.
   */
  column() {
    // Get the table
    const table = this.selection.canvasInstance.getSelectedLayout().component as CreatorTable;
    // Get the children of the table
    const children: EqComponent<any>[][] = table.getChildren();
    // Add another column by adding null to the end of each row
    for (const row of children) {
      row.push(null);
    }
    // Save the change
    this.selection.canvasInstance.save();
    // Close
    this.modal.remove();
  }

}
