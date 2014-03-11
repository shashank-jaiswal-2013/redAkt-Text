var redAkt = {
	focus_count:0,
	maximize_count:0,
	current_file_name:"",
	current_dir_name:"",
	init:function()
	{
		//window.nativeWindow.alwaysInFront="true";
		//var k = prompt("Please enter your name","Harry Potter");
		window.frames[0].document.getElementById('textarea').addEventListener("keydown",redAkt.w_cmd_submit);
		//alert(document.getElementById('context_menu').data);
		//window.frames[0].document.getElementById('textarea').addEventListener("mousedown",redAkt.textarea_contextmenu);
		//air.trace(k.innerHTML);
		//document.getElementsByTagName('body')[0].addEventListener("focus",redAkt.w_focus,false);
		//k.addEventListener("keydown",redAkt.w_cmd_submit);
		//k.addEventListener("drop",redAkt.dropHandler);
		//window.attachEvent()
		air.trace("Hello");
	},
	w_focus:function()
	{
		//air.trace("window has focus");
		if(redAkt.current_file_name!="")
			redAkt.read_file(redAkt.current_file_name);
	},
	w_Move:function()
	{
		nativeWindow.startMove(); 
	},
	dropHandler:function(event)
	{
		event.preventDefault();
		droppedText = event.dataTransfer.getData("text/html");
		air.trace("Hello"+droppedText);
		redAkt.read_file(droppedText);
	},
	quit:function()
	{
		var exitingEvent = new air.Event(air.Event.EXITING, false, true); 
    	air.NativeApplication.nativeApplication.dispatchEvent(exitingEvent); 
    	if (!exitingEvent.isDefaultPrevented()) 
    	{ 
        	air.NativeApplication.nativeApplication.exit(); 
    	} 
		//alert('Quit ?');
	},
	restore:function()
	{
		if(redAkt.maximize_count%2==0)
		{
			window.nativeWindow.maximize();
			redAkt.maximize_count++;
		}
		else
		{
			window.nativeWindow.restore();
			redAkt.maximize_count++;
		}
		//alert('Restore ?');
	},
	minimize:function()
	{
		window.nativeWindow.minimize();
		//alert('Minimize ?');
	},
	select_dir:function()
	{
		var file = new air.File(); 
		file.addEventListener(Event.SELECT, dirSelected); 
		file.browseForDirectory("Select a directory"); 
		function dirSelected(Event) { 
    		air.trace(file.nativePath);
    		read_folder(file.nativePath); 
		}
	},
	select_file:function()
	{
		var fileToOpen = air.File.userDirectory.resolvePath(redAkt.current_dir_name); 
		selectTextFile(fileToOpen); 
 
		function selectTextFile(root) 
		{ 
			//air.trace(fileToOpen.nativePath);
		    var noFilter = new air.FileFilter("All files", "*.*");
		    var asFilter = new air.FileFilter("Action Script", "*.as");
		    var cFilter = new air.FileFilter("C", "*.c");
		    var cssFilter = new air.FileFilter("Cascading Style Sheet", "*.css");
		    var htmlFilter = new air.FileFilter("Hyper Text Markup Language", "*.html");
		    var javaFilter = new air.FileFilter("Java", "*.java");
		    var jsFilter = new air.FileFilter("Javascript", "*.js");
		    var phpFilter = new air.FileFilter("PHP", "*.php");
			var pythonFilter = new air.FileFilter("Python", "*.py"); 
		    var txtFilter = new air.FileFilter("Plain Text", "*.txt");
		    root.browseForOpen("Open", [noFilter,asFilter,cFilter,cssFilter,htmlFilter,javaFilter,jsFilter,phpFilter,pythonFilter,txtFilter]); 
		    root.addEventListener(air.Event.SELECT, fileSelected); 
		} 
 
		function fileSelected(Event) 
		{ 
		    //air.trace(fileToOpen.nativePath);
		    var k = fileToOpen.nativePath;
		    var k = k.split(".");
		    //air.trace(k[k.length-1]);
		    if(k[k.length-1]=="as" || k[k.length-1]=="c" || k[k.length-1]=="css" || k[k.length-1]=="html" || k[k.length-1]=="java" || k[k.length-1]=="js"|| k[k.length-1]=="php" || k[k.length-1]=="py" || k[k.length-1]=="txt")
		    {
		    	redAkt.read_file(fileToOpen.nativePath);
		    }
		    else
		    {
		    	air.trace("Incompatible file....Opening with default application");
		    	fileToOpen.openWithDefaultApplication();
		    } 
		} 
	},
	read_folder:function(folder_name)
	{
		redAkt.current_dir_name = folder_name;
	},
	read_file:function(file_name)
	{
			redAkt.current_file_name = file_name;
			//document.getElementById('doc_title').innerHTML = file_name.split("\\")[file_name.split("\\").length-1] + " :: redAkt";
			var file_obj_name = air.File.desktopDirectory.resolvePath(file_name); 
			var obj_name = new air.FileStream();
			var str = new air.ByteArray();  
			obj_name.addEventListener(air.ProgressEvent.PROGRESS, progressHandler); 
			obj_name.addEventListener(air.Event.COMPLETE, completed); 
			obj_name.openAsync(file_obj_name, air.FileMode.READ); 
			obj_name.position = 0; 
 
			//var str = ""; 
 
			function progressHandler(event)  
			{ 
					obj_name.readBytes(str, 0, obj_name.bytesAvailable);
					//str = str.replace("\s", "_");
			        //str = obj_name.readMultiByte(obj_name.bytesAvailable, "iso-8859-1");  
			}
			function completed(event)
			{
				obj_name.close();
				//air.trace(str);
				switch(file_name.split(".")[file_name.split(".").length-1])
				{
					case 'css':
						Rainbow.color(str.toString(),'css', function(highlighted_code) {
    					str = highlighted_code;
    					//air.trace(str);
						window.frames[0].document.getElementById('textarea').innerHTML = "<pre>"+str+"</pre>";
    					});
    					break;
					case 'js':
						Rainbow.color(str.toString(),'javascript', function(highlighted_code) {
    					str = highlighted_code;
						window.frames[0].document.getElementById('textarea').innerHTML = "<pre>"+str+"</pre>";
    					});
    					break;
    				case 'py':
    					Rainbow.color(str.toString(),'python', function(highlighted_code) {
    					str = highlighted_code;
						window.frames[0].document.getElementById('textarea').innerHTML = "<pre>"+str+"</pre>";
    					});
    					break;
    				case 'html':
    					Rainbow.color(str.toString(),'html', function(highlighted_code) {
    					str = highlighted_code;
						window.frames[0].document.getElementById('textarea').innerHTML = "<pre>"+str+"</pre>";
    					});
    					break;
    				default:
    					window.frames[0].document.getElementById('textarea').innerHTML = "<pre>"+str+"</pre>";
    					break;	
				}		
			}
	},
	save_file_dir:function()
	{
		var fileToSave = air.File.documentsDirectory; 
		selectFileLocn(fileToSave); 
 
		function selectFileLocn(root) 
		{ 
			//air.trace(fileToOpen.nativePath);
		    var noFilter = new air.FileFilter("All files", "*.*");
		    var asFilter = new air.FileFilter("Action Script", "*.as");
		    var cFilter = new air.FileFilter("C", "*.c");
		    var cssFilter = new air.FileFilter("Cascading Style Sheet", "*.css");
		    var htmlFilter = new air.FileFilter("Hyper Text Markup Language", "*.html");
		    var javaFilter = new air.FileFilter("Java", "*.java");
		    var jsFilter = new air.FileFilter("Javascript", "*.js");
		    var phpFilter = new air.FileFilter("PHP", "*.php");
			var pythonFilter = new air.FileFilter("Python", "*.py"); 
		    var txtFilter = new air.FileFilter("Plain Text", "*.txt");
		    root.browseForSave("Save"); 
		    root.addEventListener(air.Event.SELECT, fileSelected); 
		} 
 
		function fileSelected(Event) 
		{ 
		    //air.trace(fileToOpen.nativePath);
		    var k = fileToSave.nativePath;
		    redAkt.current_file_name = k;
		    redAkt.save_file();
		}	
	},
	save_file:function()
	{
		if(redAkt.current_file_name=="")
		{
			redAkt.save_file_dir();
		}
		else
		if(redAkt.current_file_name!="")
		{
			var file = air.File.desktopDirectory.resolvePath(redAkt.current_file_name); 
			var str = window.frames[0].document.getElementById('textarea').innerHTML;
			/*ku = str.getElementsByTagName('span');
			air.trace(ku.length);
			l = "";
			i=0;
			while(i<ku.length-1)
			{
				ku[i].removeAttribute('class');
				air.trace(ku[i].innerHTML);
				i++;
			}*/
			var body = str;
			var temp = document.createElement("div");
			temp.innerHTML = body;
			var result = temp.textContent || temp.innerText;
			//var regex = /(<([^>]+)>)/ig,   body = str,   result = body.replace(regex, "");
			//var res = str.replace("</span>"/gi, "red");
			var fileStream = new air.FileStream();
			fileStream.openAsync(file, air.FileMode.WRITE);
			fileStream.writeUTFBytes(result);
			fileStream.addEventListener(air.Event.CLOSE, fileClosed);
			fileStream.close();

			function fileClosed(event) {
			    air.trace("Saved...");
			}
		}	
	},
	w_cmd_submit:function(e)
	{
		var evtobj = window.event? event : e
        if (evtobj.keyCode == 13)
        {
        	e.preventDefault();
        	//redAkt.select_dir();            
        }
        else
        if (evtobj.ctrlKey && !evtobj.altKey && evtobj.shiftKey && evtobj.keyCode == 73)
        {
        	//air.trace("Browse for Image: ");
        	//e.preventDefault();
        	var fileToOpen = air.File.userDirectory.resolvePath(redAkt.current_dir_name); 
		selectTextFile(fileToOpen); 
 
		function selectTextFile(root) 
		{ 
			//air.trace(fileToOpen.nativePath);
			var imgFilter = new air.FileFilter("Image Files", "*.*");
		    root.browseForOpen("Open", [imgFilter]); 
		    root.addEventListener(air.Event.SELECT, fileSelected); 
		} 
 
		function fileSelected(Event) 
		{ 
		    //air.trace(fileToOpen.nativePath);
		    var l = fileToOpen.nativePath;
		    var k = l.split(".");
		    k = k[k.length-1];
		    k = k.toLowerCase();
		    //air.trace(k[k.length-1]);
		    if(k=="jpg" || k=="png")
		    {
		    	var m = l.split("\\");
		    	var p="";
		    	oo=0;
		    	while(oo<m.length)
		    	{
		    		//air.trace(m[oo]);
		    		p = p+"/"+m[oo];
		    		oo ++;
		    	}
		    	document.getElementById('actual').style.backgroundImage = "url('file://"+p+"')";
		    	air.trace(":: Changed Background Image to"+p+" ::");
		    }
		    else
		    {
		    	alert("Incompatible file....Opening with default application");
		    	air.trace("Incompatible file....Opening with default application");
		    } 
		}
        	//redAkt.select_dir();            
        }
        else
        if (evtobj.ctrlKey && evtobj.shiftKey && evtobj.altKey && evtobj.keyCode == 73)
        {
        	air.trace(":: Changed Background Image to none ::");
        	document.getElementById('actual').style.backgroundImage = "none";
        }
        else
        if (evtobj.keyCode == 107 && evtobj.altKey)
        {
        	var current_bg_color = document.getElementById('actual').style.backgroundColor;
        	var oo = current_bg_color.length;
        	current_bg_color = current_bg_color.substr(14);
        	current_bg_color = current_bg_color.substr(0,current_bg_color.length-1);
        	var ll = parseFloat(current_bg_color)+0.07;
        	if(ll>=0.99)
        		ll=0.99;
        	document.getElementById('actual').style.backgroundColor = 'rgba(0,0,0,'+ll.toString() + ')';
        	air.trace(document.getElementById('actual').style.backgroundColor);	
        }
        else
        if (evtobj.keyCode == 109 && evtobj.altKey)
        {
        	var current_bg_color = document.getElementById('actual').style.backgroundColor;
        	var oo = current_bg_color.length;
        	current_bg_color = current_bg_color.substr(14);
        	current_bg_color = current_bg_color.substr(0,current_bg_color.length-1);
        	var ll = parseFloat(current_bg_color)-0.07;
        	if(ll<=0.01)
        		ll=0.01;
        	document.getElementById('actual').style.backgroundColor = 'rgba(0,0,0,'+ll.toString() + ')';
        	air.trace(document.getElementById('actual').style.backgroundColor);	
        }
        else
        if (evtobj.keyCode == 107 && evtobj.ctrlKey)
        {
        	var current_font_size = window.frames[0].document.getElementById('textarea').style.fontSize;
        	window.frames[0].document.getElementById('textarea').style.fontSize = (parseInt(current_font_size)+2).toString() + 'px';
        	//alert(current_font_size);	
        }
        else
        if (evtobj.keyCode == 109 && evtobj.ctrlKey)
        {
        	var current_font_size = window.frames[0].document.getElementById('textarea').style.fontSize;
        	window.frames[0].document.getElementById('textarea').style.fontSize = (parseInt(current_font_size)-2).toString() + 'px';
        	//alert(document.getElementById('yu').style.fontSize);	
        }
        else
        if (evtobj.keyCode == 79 && evtobj.ctrlKey && evtobj.shiftKey)
        {
        	redAkt.select_dir();            
        }
        else	
        if (evtobj.keyCode == 79 && evtobj.ctrlKey && !evtobj.shiftKey)
        {
        	redAkt.select_file();            
        }
        else
        if (evtobj.keyCode == 83 && evtobj.ctrlKey)
        {
        	redAkt.save_file();            
        }
        else
        if (evtobj.keyCode == 9)
        {
        	e.preventDefault();
        	var k = parseInt(window.frames[0].document.getElementById('textarea').selectionStart);
        	var whole = window.frames[0].document.getElementById('textarea').innerHTML;
        	//air.trace(window.frames[0].document.getElementById('textarea').value);
        	var first = whole.substr(0,k);
        	var last = whole.substr(k,parseInt(whole.length));
        	window.frames[0].document.getElementById('textarea').innerHTML = first+"\t"+last;
        	window.frames[0].document.getElementById('textarea').setSelectionRange(k+"\t".length,k+"\t".length);
        	//air.trace(k.toString());
        } 
	},
	cmd_submit:function(event,cmd_submitted)
	{
		if (event.which == 13 || event.keyCode == 13)
		{
            if(redAkt.focus_count%2==1)
			{
				//alert(cmd_submitted);
				cmd_submitted = (cmd_submitted.toLowerCase()).trim();
				switch(cmd_submitted)
				{
					case '':
						break;
					case 'quit':
						redAkt.quit();
						break;
					case 'minimize':
						redAkt.minimize();
						break;
					case 'full-screen':
						window.nativeWindow.maximize();
						break;
					case 'maximize':
						window.nativeWindow.maximize();
						break;	
					case 'restore':
						window.nativeWindow.restore();
						break;			
					case 'open':
						//alert('Open');
						redAkt.select_file();
						break;
					default:
						alert('Invalid command');
						break;		
				}
			}
			return false;
        }	
	},
	copy:function(e)
	{
		//e.preventDefault();
		//alert("Copy");
		 air.trace(window.getSelection()); 
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	cut:function()
	{
		//e.preventDefault();
		alert("Cut");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	paste:function()
	{
		//e.preventDefault();
		alert("Paste");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	show_unsaved_changes:function()
	{
		//e.preventDefault();
		alert("Show unsaved changes");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	select_all:function()
	{
		//e.preventDefault();
		alert("Select all");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	open_dir:function()
	{
		//e.preventDefault();
		alert("Open directory");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	copy_file_path:function()
	{
		//e.preventDefault();
		alert("Copy file path");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	reveal_in_side_bar:function()
	{
		//e.preventDefault();
		alert("Reveal in side bar");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	open_profile:function()
	{
		//e.preventDefault();
		alert("@ Shashank");
		//air.NativeApplication.nativeApplication.nativeApplication.copy();
		redAkt.hide_context();
	},
	hide_context:function()
	{
		var context_menu = document.getElementById('context_menu');
		context_menu.style.display = "none";
		context_menu.innerHTML = "";
	},
	context_menu:0,
	textarea_contextmenu:function(e)
	{
		//e.preventDefault();
		//air.trace(window.frames[0].document.getElementById('textarea').getAttribute('contentEditable'));
		switch (e.which) {
        case 1:
        	//e.preventDefault();
        	//window.frames[0].document.getElementById('textarea').setAttribute('contentEditable','true');
			redAkt.hide_context();
            //alert('Left mouse button pressed');
            break;
        case 2:
            //alert('Middle mouse button pressed');
            break;
        case 3:
        	
			var context_menu = document.getElementById('context_menu');
			context_menu.style.display = "block";
			//context_menu.innerHTML = "<li id='copy' onmousedown='redAkt.copy()'>Copy</li><li>Cut</li><li>Paste</li><li class='disabled'>Show unsaved changes</li><li>Select All</li><li>Open Containing Folder</li><li>Copy file Path</li><li>Reveal in side Bar</li><li class='disabled'>&copy; Shashank</li>";
			var list=document.createElement("li");
			var node=document.createTextNode("Copy");
			list.onclick =  redAkt.copy; 
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Cut");
			list.onclick = redAkt.cut;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Paste");
			list.onclick = redAkt.paste;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Show unsaved changes");
			list.setAttribute('class','disabled');
			list.onclick = redAkt.show_unsaved_changes;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Select all");
			list.onclick = redAkt.select_all;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Open Containing folder");
			list.onclick = redAkt.open_dir;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Copy file path");
			list.onclick = redAkt.copy_file_path;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("Reveal in side Bar");
			list.onclick = redAkt.reveal_in_side_bar;
			list.appendChild(node);
			context_menu.appendChild(list);
			var list=document.createElement("li");
			var node=document.createTextNode("@ Shashank");
			list.setAttribute('class','disabled');
			list.onclick = redAkt.open_profile;
			list.appendChild(node);
			context_menu.appendChild(list);
			context_menu.style.top = e.clientY;
			context_menu.style.left = e.clientX;
			redAkt.context_menu++;
			return false;
            //alert('Right mouse button pressed');
            break;
        default:
            alert('You have a strange mouse');
        }
    
	},
	input_focus:function()
	{
		redAkt.focus_count++;
		//alert(redAkt.focus_count.toString());
	},
	input_blur:function()
	{
		redAkt.focus_count--;
		//alert(redAkt.focus_count.toString());
	}
}