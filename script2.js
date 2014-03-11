var redAkt = {
	focus_count:0,
	maximize_count:0,
	current_file_name:"",
	current_dir_name:"",
	init:function()
	{
		//document.getElementsByTagName('body')[0].addEventListener("focus",redAkt.w_focus,false);
		//document.getElementById('textarea').attachEvent("drop",redAkt.dropHandler);
		//window.attachEvent()
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
	context_menu:0,
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