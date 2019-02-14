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
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ColorPickerComponent,
    LoadComponent,
    SaveComponent,
    PreviewComponent,
    TextEditorComponent
  ]
})
export class AppModule { }
