function FacebookShortcuts() {
	this.chatList = $('ul.fbChatOrderedList').first();
	this.chatPopups = $('#ChatTabsPagelet > .fbNubGroup > .fbNubGroup');
	this.searchBar = $('#pagelet_sidebar > .fbChatSidebar > .uiGrid .inputsearch');
	var obj = this;
	document.onkeypress = function(event) {
		obj.onKeyPress(event);
	}
}

// Returns whether the chat is visible or not
FacebookShortcuts.prototype.isChatVisible = function() {
	return (this.chatList.is(':visible'));
}


FacebookShortcuts.prototype.toggleChat = function() {
	// I couldn't figure out which button in the DOM to click
	// The hide sidebar button calls Chat.toggleSidebar(),
	// but there was no actiona associated with the minimized sidebar tab
	var elem = document.createElement('SCRIPT');
	elem.innerHTML = 'Chat.toggleSidebar()';
	document.head.appendChild(elem);
	elem.parentNode.removeChild(elem);
}

FacebookShortcuts.prototype.selectSearch = function() {
	if (!this.isChatVisible()) this.toggleChat();
	this.searchBar.focus();
}

FacebookShortcuts.prototype.selectChat = function(num) {
	var count = 0;
	this.chatPopups.children().each(function() {
		if ($(this).is(':visible')) {
			// This chat is visible
			count++;
			if (count == num) {
				if (!$(this).hasClass('opened')) {
					// This chat is minimized, click to open it
					// jQuery wasn't helping here...
					this.firstChild.click();
				}
				$(this).find('.uiTextareaAutogrow').focus();
				return false;
			}
		}
	});
}

// Pretty ugly DOM traversl here, navigate up to the element that holds
// the entire popup, then find the one H4 element, which is the header
FacebookShortcuts.prototype.minimizeChat = function() {
	// Check if nothing in focus
	if ($(':focus').length == 0) return;
	// Check if we're actually in a chat window
	if ($(':focus').get(0).tagName != 'TEXTAREA') return;
	// Make sure we're in the correct text area
	var popupSection = $(':focus').parent().parent();
	if (!popupSection.hasClass('fbNubFlyoutFooter')) return;
	popupSection.parent().find('H4').click();
}

FacebookShortcuts.prototype.onKeyPress = function(event) {
	if (event.ctrlKey) {
		var key = event.keyCode;
		if (key == 19) {
			// S
			this.selectSearch();
		} else if (key == 3) {
			// C
			this.toggleChat();
		} else if (49 <= key && key <= 57) {
			// 1-9
			this.selectChat(key - 48)
		} else if (key == 13) {
			// M
			this.minimizeChat();
		}
		// Remaining buttons:
		
		// G = 7
		// I = 9
		// L = 12
		// Q = 17
		// R = 18
		// U = 21
		// V = 22
		// W = 23
		// Y = 25
		// Z = 26
	}
}

window.onload = function() {
	var shortcuts = new FacebookShortcuts();
}