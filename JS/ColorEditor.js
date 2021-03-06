
    let Colors = [];
    let BaseCol = [];
    var Reader = new FileReader();
    var Lines = [];
    var ChunkyString = "";
    let ColDiv = document.getElementById("ColDiv");
    const FileSelector = document.getElementById('FileSelector');
   
    FileSelector.addEventListener('change',(event)=>{
        const FileList = event.target.files;
        ReadFile(FileList[0]);
    });

    function ReadFile(File)
    {

        var Generator = document.getElementById("GenerateBtn");
        Generator.removeAttribute("disabled");

      
        Reader.addEventListener('progress',(event)=>{
            if(event.loaded && event.total){
                const Percent = (event.loaded/event.total)*100;
            }
        });

        Reader.addEventListener('load',(event)=>{
            const Result = event.target.result;
            Lines = Result.split('\n');
            for(var Line = 0; Line < Lines.length;Line++)
            {
                if(Lines[Line].search("#")!=-1)
                {
                    let HashLoc = Lines[Line].search("#");
                    let ExtractCol = Lines[Line].substr(HashLoc+1,6);
                    if(!Colors.includes(ExtractCol))
                    {
                        Colors.push(ExtractCol);
                        BaseCol.push(ExtractCol);
                    }
                    
                }
            }
            DrawBands();
        });

        Reader.readAsText(File);

        
        
    }

    function DrawBands()
    {
        for (let i = 0; i < Colors.length; i++)
        {
            let Color = Colors[i];
            var Text = document.createElement("Input");
            var Label = document.createElement("Label")
            Text.id=i;
            Label.id=i + "Label";
            Label.for = Text.id;
            Text.type = "Color";
            Label.innerHTML = "#" + Color;
            Label.style.textAlign = "center";
            Label.style.position = "absolute";
            Text.style.display = "block";
            Text.style.borderRadius = "5px";
            Text.style.border = "0px";
            Text.style.padding = "20px";
            Text.style.width = "100%";
            Text.style.textAlign = "center";
            Label.style.color = "#eeeeee";
            Label.style.fontSize = 24;
            Label.style.fontFamily = "Helvetica";
            Label.style.textShadow = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";
            Text.style.background = "#" + Color;
            Text.value = "#" + Color; 
            Text.addEventListener("change", function() {
                Text = this;
                document.getElementById(Text.id + "Label").innerHTML = Text.value;
                Colors[Text.id] = Text.value.substr(1,6);
                Text.style.background = Text.value;
            
            });
            ColDiv.appendChild(Label);
            ColDiv.appendChild(Text);
        
         }

    }

    function Write()
    {
//iterate through Lines again, write what is in Lines, if substr # is found match the key from the original to the new color and write it.
        for (let i = 0; i < Lines.length; i++) {
            const Line = Lines[i];
            if (Line.search("#")!= -1) 
            {
                HashtagPos = Line.search("#");
                OldCol = Line.substr(HashtagPos+1,6);
                NewCol = Colors[BaseCol.indexOf(OldCol)];
                var End = (Line.includes(">"));
                Lines[i] = Line.substr(0,HashtagPos) + "#" + NewCol + '"';

                if (End) {

                    Lines[i] += ">";
                }
                Lines[i] += '\n'
                
            }
            //edited the lines
            ChunkyString = ChunkyString + Lines[i];
        }
        var NewTheme = document.createElement('a');
        var Strings = [ChunkyString]
        var MyBlob = new Blob(Strings,{ type: 'text/plain;charset=utf-8;' });
        var url = URL.createObjectURL(MyBlob);
        NewTheme.setAttribute('href',url);
        NewTheme.setAttribute('download', "NewTheme.XML");
        NewTheme.click();
    }

