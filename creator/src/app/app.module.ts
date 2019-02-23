import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { ContentPaneComponent } from './content-pane/content-pane.component';
import { CentralAreaComponent } from './central-area/central-area.component';
import { StepsComponent } from './steps/steps.component';
import { ModalDirective } from './modal.directive';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { LoadComponent } from './load/load.component';
import { SaveComponent } from './save/save.component';
import { PreviewComponent } from './preview/preview.component';
import { StepTextComponent } from './step-text/step-text.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { SubSuperAlignmentComponent } from './sub-super-alignment/sub-super-alignment.component';
import { FormsModule } from '@angular/forms';
import {  StepOptionsComponent,
          CloneContainerDirective,
          MergeContainerDirective,
          EvalContainerDirective } from './step-options/step-options.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolBarComponent,
    ContentPaneComponent,
    CentralAreaComponent,
    StepsComponent,
    ModalDirective,
    ColorPickerComponent,
    LoadComponent,
    SaveComponent,
    PreviewComponent,
    StepTextComponent,
    TextEditorComponent,
    SubSuperAlignmentComponent,
    StepOptionsComponent,
    CloneContainerDirective,
    MergeContainerDirective,
    EvalContainerDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ColorPickerComponent,
    LoadComponent,
    SaveComponent,
    PreviewComponent,
    TextEditorComponent,
    SubSuperAlignmentComponent,
    StepOptionsComponent
  ]
})
export class AppModule { }
