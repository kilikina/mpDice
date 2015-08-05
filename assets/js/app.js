var this_player_id = new Date().getTime()
		var player2       = $('#player2');
		var player1            = $('#player1');
		var output         = $('#output');

				
		// Sandbox credentials (pubnub.com)
		var pubnub = PUBNUB.init({
			publish_key: '',
			subscribe_key: ''
		});
		
		
		/*-------------------------------------------------------------------------------------------------
		Subscribe to the channel
		This is triggered after every turn
		-------------------------------------------------------------------------------------------------*/
		pubnub.subscribe({
			channel: 'game',
			message: function(message){
			
				// Turn the string of JSON into an array
				var results   = $.parseJSON(message);
								
				// Pull the player_id and roll out of the array
				var player_id = results['player_id'];
				var roll      = results['roll'];				
				
				// Play!
				play(player_id,roll);
			},
			
		});
		
		
		/*-------------------------------------------------------------------------------------------------
		Player 1 rolls
		-------------------------------------------------------------------------------------------------*/
		$('#roll').click(function() {
			
			// Player 1 roll
			var random_number = Math.floor((Math.random()*5)+1);
						
			// Output
			output.html('Waiting for an opponent to roll...<br>');
			player1.html(random_number);

			// Data of player_id and roll
			data = { 
				'player_id' : this_player_id, 
				'roll' : random_number 
			}
			
			// Convert data to JSON string
			var message = JSON.stringify(data);
			
			// Publish 
			pubnub.publish({
				channel: 'game',        
				message: message,
			});
			
			// Get rid of button so you can't roll again
			$('button').hide();
				
		});
	
	
		/*---------------------------------------------------------------------------------
		Called after a player rolls. Responsible for determining where we are in the game.
		-----------------------------------------------------------------------------------*/	
		function play(player_id, roll) {
				
			// Roll was by Player 2
			if(player_id != this_player_id) {
					
				// Output
				player2.html(roll);
				
				// Player 2 has rolled, Player 1 has not
				if(player2.html() != '' && player1.html() == '') {
					output.html('An opponent is waiting for you to roll...<br>');	
				}
			}
			
			// End of game = both Player 1 and Player 2 have rolled - see who wins
			if(player2.html() != '' && player1.html() != '') {
				
				// Clear the output
				output.html('');	
				
				if(player2.html() == player1.html()) {
					output.append('A tie!<br>');	
				}
				// Player 2 roll was higher than Player 1, Player 2 lost
				else if(player2.html() > player1.html()) {
					output.append('Winner: Player 2<br>');	
				}
				// Player 1 roll was higher than Player 2, Player 1 wins
				else {
					output.append('Winner: Player 1<br>');	
				}
				
				output.append('Starting a new game in 3 seconds...<br>');	
				
				// Refresh game after 3 seconds to begin a new game
				setTimeout(function(){
					location.reload();
				},3000);
			}
			
			
		}